
const Character = require('../models/character')
const User = require('../models/user')
const shortid = require('shortid');


module.exports = {
    index,
    new: newCharacter,
    delete: deleteCharacter,
    show,
    create,
    comment,
    update,
    editPage,
    search
}
// Define the function to show all the characters
function index(req, res) {
    const user = req.user
    // Find all the characters that belong to the user
    Character.find({ user }, function (err, characters) {
        if (err) {
            res.send(err)
        } else {
            // Render the index page and pass in the character data
            res.render('characters/index', { title: "Characters", characters })
        }
    })
}

// Define the function to create a character
async function create(req, res) {
    try {
        // Find the user that is creating the character
        const user = await User.findOne({ googleId: req.user.googleId });
        // Check if there are any duplicate stats
        const primaryStat = req.body.primaryStat;
        const secondaryStat = req.body.secondaryStat;
        const tertiaryStat = req.body.tertiaryStat;
        const raceSelection = req.body.race

        if (primaryStat === secondaryStat || secondaryStat === tertiaryStat || tertiaryStat === primaryStat) {
            return res.status(400).send({ message: 'Error: Primary, Secondary, and Tertiary stats cannot be the same' });
        }

        // Generate the stats for the character based on the input data
        let generatedStats = createStats(primaryStat, secondaryStat, tertiaryStat, raceSelection)
        // Create a new Character object and save it to the database
        const character = new Character({
            name: req.body.name,
            charID: randID(),
            user: user._id,
            stats: generatedStats,
            race: raceSelection
        });
        await character.save();
        // Redirect to the index page
        res.redirect('/characters');
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred while saving the character' });
    }
}

// Define the function to delete a character
function deleteCharacter(req, res) {
    // Find the character by ID and delete it from the database
    Character.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            res.send(err);
        } else {
            // Redirect to the index page
            res.redirect('/characters');
        }
    });
}

// Define the function to show the page to create a new character
function newCharacter(req, res) {
    res.render('characters/new', { title: "Characters" });
}

// Define the function to show a specific character
function show(req, res) {
    // Find the character by ID and render the show page
    Character.findById(req.params.id, (err, character) => {
        if (err) {
            res.send(err);
        } else {
            let isUserAuthorized = false;
            // Check if the current user is authorized to edit the character
            if (req.user && req.user._id.equals(character.user)) {
                isUserAuthorized = true;
            }
            // Render the Character's Page
            res.render('characters/show', {
                character,
                title: character.name,
                isUserAuthorized
            });
        }
    })
}
// A function that simulates rolling a number of dice and adding them together,
// with an optional bonus added to the total.
function rollDice(numDice, sides, bonus) {
    let result = 0;
    for (let i = 0; i < numDice; i++) {
        // Generate a random number between 1 and the number of sides on the dice,
        // and add it to the total.
        result += Math.floor(Math.random() * sides) + 1;
    }
    // Add the bonus to the total and return the result.
    return result + bonus;
}

// A function that creates a new set of character stats based on the selected
// primary, secondary, and tertiary stats, as well as the selected race.
function createStats(primaryStat, secondaryStat, tertiaryStat, raceSelection) {
    // Create a new object to hold the character's stats.
    const characterStats = {
        lifePoints: 0,
        agility: 2,
        force: 2,
        tenacity: 2,
        scholarship: 2,
        insight: 2,
        spirit: 2,
        personality: 2,
    };
    // Set the values of the primary, secondary, and tertiary stats.
    characterStats[primaryStat] = 8;
    characterStats[secondaryStat] = 6;
    characterStats[tertiaryStat] = 4;
    // Look up the stat modifiers for the selected race and add them to the character's stats.
    let raceToParse = getRace(raceSelection)
    Object.keys(characterStats).forEach((stat, i) => {
        characterStats[stat] += raceToParse[i];
    });
    // Roll the character's life points based on their tenacity stat.
    characterStats['lifePoints'] = rollDice(5, 10, characterStats['tenacity']);
    // Return the updated character stats.
    return characterStats;
}

// A function that returns the stat modifiers for a given race.
function getRace(race) {
    let raceObj = {
        //'template': ["lifePoints", "agility", "force", "tenacity", "Scholarship", "Insight", "Spirit", "Personality"]
        'android': [4, 0, 4, 4, 0, 2, 0, 0],
        'arcosian': [3, 4, 2, 4, 0, 0, 0, 0],
        "earthlingAgility": [4, 4, 0, 0, 2, 4, 0, 0],
        "earthlingTenacity": [4, 0, 0, 4, 2, 4, 0, 0],
        "majinForce": [3, 0, 4, 2, 0, 0, 0, 4],
        "majinSpirit": [3, 0, 0, 2, 0, 0, 4, 4],
        "namekianForce": [5, 0, 2, 4, 0, 4, 0, 0],
        "namekianSpirit": [5, 0, 0, 4, 0, 4, 2, 0],
        "neotuffle": [4, 0, 0, 4, 2, 4, 0, 0],
        "saiyan": [3, 2, 4, 4, 0, 0, 0, 0],
        "shadowDragonForce": [3, 0, 4, 4, 0, 0, 0, 2],
        "shadowDragonSpirit": [3, 0, 0, 4, 0, 0, 4, 2],
        'default': [0, 0, 0, 0, 0, 0, 0, 0]
    }
    let raceChoice = raceObj[race] || raceObj['default']
    return raceChoice
}
function comment(req, res) {
    if (!req.user || !req.user.name) {
        return res.status(400).send("User not found or missing name");
    }

    const newComment = { content: req.body.content, author: req.body.name };

    Character.findById(req.params.id, (err, character) => {
        if (err) {
            return res.status(400).send("Character not found");
        }

        if (!character) {
            return res.status(404).send("Character not found");
        }

        character.comments.push(newComment);
        character.save((err) => {
            if (err) {
                console.log(err)
                return res.status(500).send("Failed to save comment");
            }
            return res.redirect(`/characters/${character._id}`);
        });
    });
}

async function update(req, res) {
    try {
        const character = await Character.findById(req.params.id);
        if (!character) {
            return res.status(404).send({ message: 'Character not found' });
        }

        // Only allow the owner of the character to edit it
        if (!req.user || !req.user._id.equals(character.user)) {
            return res.status(403).send({ message: 'You are not authorized to edit this character' });
        }

        const primaryStat = req.body.primaryStat;
        const secondaryStat = req.body.secondaryStat;
        const tertiaryStat = req.body.tertiaryStat;
        const raceSelection = req.body.race;

        if (primaryStat === secondaryStat || secondaryStat === tertiaryStat || tertiaryStat === primaryStat) {
            return res.status(400).send({ message: 'Error: Primary, Secondary, and Tertiary stats cannot be the same' });
        }

        const updatedStats = createStats(primaryStat, secondaryStat, tertiaryStat, raceSelection);
        character.name = req.body.name;
        character.stats = updatedStats;
        character.race = raceSelection;
        await character.save();

        res.redirect(`/characters/${req.params.id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred while updating the character' });
    }
}
function editPage(req, res) {
Character.findById(req.params.id, (err, character) => {
    if (err) {
      console.log(err);
      res.redirect('/characters');
    } else {
      res.render('characters/edit', { character: character, title: character.name });
    }
  });
}

function search(req,res) {
    const query = req.query.name;
    console.log('req.query.name', query);
    Character.find({ $or:[{ name: new RegExp(query, 'i') },{charID: query}]}, (err, characters) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal server error');
      }
  
      if (characters.length === 1) {
        return res.redirect(`/characters/${characters[0]._id}`);
      } else {
        return res.redirect(`/characters`)
      }
    });
  }

  function randID() {
    return shortid.generate();
  }