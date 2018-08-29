const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load Profile Model
const Profile = require('../../models/Profile');
//Load User Profile
const User = require('../../models/User');

// @route   GET api/profile
// @desc    Gets Current Users Profile
// @access  Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
      const errors = {};
  
      Profile.findOne({ user: req.user.id })
        .populate('user', ['name', 'image'])
        .then(profile => {
          if (!profile) {
            errors.noprofile = 'There is no profile for this user';
            return res.status(404).json(errors);
          }
          res.json(profile);
        })
        .catch(err => res.status(404).json(err));
    }
  );

// @route   POST api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public

router.get('/handle/:handle', (req, res) => {
  const errors = {};

  Profile.findOne({handle: req.params.handle})
  .populate('user', ['name', 'image'])
  .then(profile => {
    if(!profile) {
      errors.noprofile = 'There is no profile for this user';
      res.status(404).json(errors);
    }

    res.json(profile);
  })
  .catch(err => res.status(404).json(err));
});

// @route   POST api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get('/user/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({user: req.params.user_id})
  .populate('user', ['name', 'image'])
  .then(profile => {
    if(!profile) {
      errors.noprofile = 'There is no profile for this user';
      res.status(404).json(errors);
    }

    res.json(profile);
  })
  .catch(err => res.status(404).json({profile: 'There is no profile for this user'}));
});

// @route   POST api/profile
// @desc    Creates User Profile
// @access  Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
      //Get fields
      const profileFields = {};
      profileFields.user = req.user.id;
      if(req.body.handle) profileFields.handle = req.body.handle;
      if(req.body.location) profileFields.location = req.body.location;
      if(req.body.weight) profileFields.weight = req.body.weight;
      if(req.body.age) profileFields.age = req.body.age;
      if(req.body.height) profileFields.height = req.body.height;
      if(req.body.bio) profileFields.bio = req.body.bio;
      if(req.body.goal) profileFields.goal = req.body.goal;

      profileFields.social = {};
      if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
      if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
      if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

      Profile.findOne({user: req.user.id })
        .then(profile => {
          if(profile) {
            //updates
            Profile.findOneAndUpdate({user:req.user.id}, {$set: profileFields}, {new: true})
            .then(profile => res.json(profile));
          } else {
            //Create

            //Check if handle exists
            Profile.findOne({ handle: profileFields.handle }).then(profile => {
              if (profile) {
                errors.handle = 'That handle already exists';
                res.status(400).json(errors);
              }

              //Save Profile
              new Profile(profileFields).save().then(profile => res.json(profile));
            })
          }
        })

    }
  );

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req,res) => {
  const errors = {};

  Profile.find()
  .populate('user', ['name', 'image'])
  .then(profiles => {
    if(!profiles) {
      errors.noprofile =  'There are no profiles';
      return res.status(404).json(errors);
    }

    res.json(profiles);
  })
  .catch(err =>
    res.status(404).json({profile: 'There are no profiles'}));
})
  

module.exports = router;