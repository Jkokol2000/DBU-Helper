// Import the required models
const Campaign = require('../models/campaign')
const Character = require('../models/character')
const User = require('../models/user')
// Export the functions
module.exports = {
    index,
    new: newCampaign,
    delete: deleteCharacter,
    show,
    create,
    addCharacter
}
// Handler for the campaigns index page
function index(req, res) {
    // Get the authenticated user
    const user = req.user
    // Find all campaigns for the user
    Campaign.find({ user }, function (err, campaigns) {
        if (err) {
            // Send an error if there's a problem
            res.send(err)
        } else {
            // Render the campaigns index page with the found campaigns
            res.render('campaigns/index', { title: "Campaigns", campaigns })
        }
    })
}
// Handler for creating a new campaign
async function create(req, res) {
    try {
        // Find the authenticated user in the database
        const user = await User.findOne({ googleId: req.user.googleId });
        // Create a new Campaign document with the provided information
        const campaign = new Campaign({
            name: req.body.name,
            creator: user.name,
            creatorID: user._id,
            description: req.body.description,
            characters: []
        });
        // Save the new campaign to the database
        await campaign.save();
         // Redirect the user to the campaigns index page
        res.redirect('/campaigns');
    } catch (error) {
        // Send an error if there's a problem
        console.error(error);
        res.status(500).send({ message: 'An error occurred while saving the character' });
    }
}
// Handler for deleting a campaign
function deleteCharacter(req, res) {
    // Find and delete the specified campaign
    Campaign.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            // Send an error if there's a problem
            res.send(err);
        } else {
            // Redirect the user to the campaigns index page
            res.redirect('/campaigns');
        }
    });
}
// Handler for rendering the page to create a new campaign
function newCampaign(req, res) {
    res.render('campaigns/new', { title: "New Campaign" });
}
// Handler for rendering the page for a specific campaign
async function show(req, res) {
    try {
        // Find the specified campaign and populate its characters
        const campaign = await Campaign.findById(req.params.id).populate('characters');
        const characters = await Character.find({ user: req.user._id });
    
        let isCreator = false;
        let isPlayer = false
        if (campaign.creatorID.includes(req.user._id)) {
          isCreator = true;
        }
        for (let character of campaign.characters) {
            if (character.user.equals(req.user._id)) {
              isPlayer = true;
              break;
            }
          }
        
        res.render('campaigns/show', { campaign, characters, currentUser: req.user, isCreator, isPlayer, title: "Campaign" });
      } catch {
        res.redirect('/campaigns');
      }
    }

async function addCharacter(req, res) {
    const campaignId = req.params.id;
    const characterId = req.body.characterId;

    try {
        // Check if the character exists
        const character = await Character.findById(characterId).exec();
        if (!character) {
            res.status(400).send({ message: 'Character not found' });
            return;
        }

        // Update the campaign
        const campaign = await Campaign.findById(campaignId).exec();
        if (!campaign) {
            res.status(400).send({ message: 'Campaign not found' });
            return;
        }

        campaign.characters.push(character._id);
        await campaign.save();
        res.redirect(`/campaigns/${campaignId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred while adding the character to the campaign' });
    }
}