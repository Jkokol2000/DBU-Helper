const Character = require('../models/characters')
const User = require('../models/user')

module.exports = {
    index,
    new: newCharacter,
    delete: deleteCharacter,
    show,
    create
}

function index(req, res) {
    const user = req.user
    Character.find({user}, function(err, characters) {
        if (err) {
            res.send(err)
        } else {
        res.render('characters/index', {title:"Characters", characters})
   }})
}

async function newCharacter(req, res) {
    try {
    const user = await User.findOne({ googleId: req.user.googleId });
    // Check if there are any duplicate stats
    const primaryStat = req.body.primaryStat;
    const secondaryStat = req.body.secondaryStat;
    const tertiaryStat = req.body.tertiaryStat;
    const raceSelection = req.body.race
    
    if (primaryStat === secondaryStat || secondaryStat === tertiaryStat || tertiaryStat === primaryStat) {
      return res.status(400).send({ message: 'Error: Primary, Secondary, and Tertiary stats cannot be the same' });
    }
    
    
    
   let generatedStats = createStats(primaryStat, secondaryStat, tertiaryStat, raceSelection)
    const character = new Character({
      name: req.body.name,
      user: user._id,
      stats: generatedStats,
      race: raceSelection
    });
    await character.save();
    res.redirect('/characters');
    } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while saving the character' });
    }
    }
    
    
function deleteCharacter(req, res) {
    Character.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/characters');
        }
    });
}

function create(req, res) {
    res.render('characters/new', {title:"Characters"});
}

function show(req,res) {
    Character.findById(req.params.id, (err, character) => {
        if (err) {
          res.send(err);
        } else {
            let isUserAuthorized = false;
            if (req.user && req.user._id.equals(character.user)){
                isUserAuthorized = true;
            }
            res.render('characters/show', {
                character,
                title: character.name,
                isUserAuthorized
            });
        }
})
}

function rollDice(numDice, sides, bonus) {
    let result = 0;
    for (let i = 0; i < numDice; i++) {
        result += Math.floor(Math.random()*sides)+1;
    }
    return result + bonus
}

function createStats(primaryStat, secondaryStat, tertiaryStat, raceSelection){
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
    characterStats[primaryStat] = 8;
    characterStats[secondaryStat] = 6;
    characterStats[tertiaryStat] = 4;
    let raceToParse = getRace(raceSelection)
    Object.keys(characterStats).forEach((stat, i) => {
        characterStats[stat] += raceToParse[i];
    });
    characterStats['lifePoints'] = rollDice(5, 10, characterStats['tenacity']);
    return characterStats
}

function getRace(race) {
    let raceObj = {
        'Earthling': [4,4,0,0,2,4,0,0],
        'default': [0,0,0,0,0,0,0,0]
    }
    let raceChoice = raceObj[race] || raceObj['default']
    return raceChoice
}