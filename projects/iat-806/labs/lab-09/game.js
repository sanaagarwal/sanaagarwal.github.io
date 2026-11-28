let health = 0;
let waiting = false;

const foodInput = document.querySelector("#food");
const feedButton = document.querySelector("#feed");
const resetButton = document.querySelector("#reset");

const output = document.querySelector("#output");
const statusDisplay = document.querySelector("#status");
// const historyDisplay = document.querySelector("#history");

const moodScores = {
    excited: 20,
    happy: 10,
    neutral: 0,
    sleepy: 0,
    sad: -5,
    angry: -10,
    disgusted: -10
};

feedButton.addEventListener("click", feedPet);
resetButton.addEventListener("click", resetPet);

foodInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        feedPet();
    }
});


function makePrompt(food) {

    return `
        You are a picky but curious magical cat in a fictional game.

        You usually like fish, meat, seafood and crunchy snacks.
        You usually dislike bitter, sour, spicy and rotten things.

        These are preferences, not strict rules.

        You can eat anything, even imaginary objects or abstract ideas.
        You are cautious about unfamiliar things but willing to try them.

        Weird things can be delicious, disgusting or simply uninteresting.
        Do not assume that unfamiliar things are always good or bad.

        Be creative and do not automatically like everything.

        The player feeds you: ${JSON.stringify(food)}

        Choose a mood based on how much you enjoy this particular item:

        excited = love it
        happy = like it
        neutral or sleepy = indifferent
        sad = disappointed
        angry or disgusted = strongly dislike it

        Make your reaction match your mood.

        Choose a body color that reflects the item or your reaction.
        Ordinary items usually keep two eyes.
        Magical mutations are optional.

        Return only a JSON object with these fields:

        mood: one of excited, happy, neutral, sleepy, sad, angry, disgusted
        color: a six-digit hex color starting with #
        eyes: an integer from 1 to 4
        size: a number from 0.75 to 1.2
        reaction: one short funny sentence in the cat's voice

        No markdown or extra text.
        This is fantasy, not real animal care.
    `;

}

async function feedPet() {

    const food = foodInput.value.trim();
    if (food === "" || waiting) {
        return;
    }
    waiting = true;
    feedButton.disabled = true;
    resetButton.disabled = true;

    output.textContent = "Sniffing " + food + "...";

    try {
        const answer = await chat(makePrompt(food));
        console.log("AI response:", answer);

        const cleanAnswer = answer.replace(/```json|```/gi, "").trim();
        const reaction = JSON.parse(cleanAnswer);

        if (!Object.keys(moodScores).includes(reaction.mood) ||
            typeof reaction.color !== "string" ||
            !/^#[0-9a-f]{6}$/i.test(reaction.color) ||
            !Number.isInteger(reaction.eyes) ||
            reaction.eyes < 1 || reaction.eyes > 4 ||
            typeof reaction.size !== "number" ||
            reaction.size < 0.75 || reaction.size > 1.2 ||
            typeof reaction.reaction !== "string") {
            throw new Error("Invalid AI response. Try feeding again.");
        }

        pet.mood = reaction.mood;
        pet.color = reaction.color;
        pet.eyes = reaction.eyes;
        pet.size = reaction.size;

        const points = moodScores[pet.mood];
        health = health + points;

        const pointsText = points > 0 ? "+" + points : points;
        output.textContent = reaction.reaction + " (" + pointsText + " health)";
        statusDisplay.textContent = "Health: " + health + " | Mood: " + pet.mood;

        const item = document.createElement("li");
        item.textContent = food + " — " + pet.mood + " (" + pointsText + "): " + reaction.reaction;

        // historyDisplay.appendChild(item);
        foodInput.value = "";

    } catch (error) {
        output.textContent = "Could not feed the cat. " + error.message;
        console.error(error);
    }

    waiting = false;
    feedButton.disabled = false;
    resetButton.disabled = false;
}

function resetPet() {

    pet = createPet();
    health = 0;
    foodInput.value = "";
    output.textContent = "I'm hungry!";
    statusDisplay.textContent = "Score: 0 | Mood: neutral";
    // historyDisplay.textContent = "";

}
