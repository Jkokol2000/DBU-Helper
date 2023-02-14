const Campaign = require('../models/campaigns')
const User = require('../models/user')

module.exports = {
    index,
    new: newCampaign,
    delete: deleteCharacter,
    show,
    create,
}

function index(req, res) {
    const user = req.user
    Campaign.find({ user }, function (err, campaigns) {
        if (err) {
            res.send(err)
        } else {
            res.render('campaigns/index', { title: "Campaigns", campaigns })
        }
    })
}

async function newCampaign(req, res) {
    try {
        const user = await User.findOne({ googleId: req.user.googleId });
        // Check if there are any duplicate stats
        const campaign = new Campaign({
            name: req.body.name,
            creator: user._id,
            description: req.body.description,
            characters: []
        });
        await campaign.save();
        res.redirect('/campaigns');
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred while saving the character' });
    }
}

function deleteCharacter(req, res) {
    Campaign.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/campaigns');
        }
    });
}

function create(req, res) {
    res.render('campaigns/new', { title: "New Campaign" });
}

function show(req, res) {
    Campaign.findById(req.params.id, (err, campaign) => {
        if (err) {
            res.send(err);
        } else {
            let isUserAuthorized = false;
            if (req.user && req.user._id.equals(campaign.user)) {
                isUserAuthorized = true;
            }
            res.render('campaigns/show', {
                campaign,
                title: campaign.name,
                isUserAuthorized
            });
        }
    })
}