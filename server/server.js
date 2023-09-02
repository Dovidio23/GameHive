require("dotenv").config();

const express = require("express");
const cors = require('cors')
const morgan = require("morgan");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { v4: uuid } = require('uuid')
const { MongoClient } = require("mongodb");
const { SECRET_KEY } = process.env
const { MONGO_URI } = process.env;
const options = { useNewUrlParser: true, useunifiedTopology: true };
const saltRounds = 10

const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
}

const client = new MongoClient(MONGO_URI, options);
client.connect();
const db = client.db("Gamehive");

const PORT = 4000;


const createUser = async (req, res) => {
    const { username, email, password, favorites, reviews, bio, profilePicture, following, followers } = req.body
    const lowercaseUsername = username.toLowerCase()
    try {

        const existingUsername = await db.collection("users").findOne({ username: lowercaseUsername })
        const existingEmail = await db.collection("users").findOne({ email })
        if (existingUsername) {
            return res.status(400).json({ status: 400, message: "Username already taken." })
        }
        if (existingEmail) {
            return res.status(400).json({ status: 400, message: "Email already registered." })
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const userId = uuid()
        const user = {
            _id: userId,
            username: lowercaseUsername,
            email,
            password: hashedPassword,
            favorites: favorites || [],
            reviews: reviews || [],
            bio,
            profilePicture: profilePicture || "/assets/ProfilePic6.png",
            following: following || [],
            followers: followers || []
        }
        const result = await db.collection("users").insertOne(user)
        return res.status(201).json({ status: 201, message: "User created", user })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ status: 500, message: "Interal Server Error" })
    }
}
const updateFavorites = async (req, res) => {
    const { userId, favorite } = req.body;

    try {
        const user = await db.collection("users").findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the game is already in the user's favorites
        const gameIndex = user.favorites.findIndex(fav => fav.gameId === favorite.gameId);

        if (gameIndex === -1) {
            // Game is not in favorites, so add it
            user.favorites.push(favorite);
        } else {
            // Game is already in favorites, so remove it
            user.favorites.splice(gameIndex, 1);
        }

        await db.collection("users").updateOne(
            { _id: userId },
            { $set: { favorites: user.favorites } }
        );

        return res.status(200).json({ message: "Favorites updated successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body
    const lowercaseUsername = username.toLowerCase()
    try {
        const user = await db.collection("users").findOne({ username: lowercaseUsername })

        const isMatch = user ? await bcrypt.compare(password, user.password) : false 

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password." })
        }
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '30m' })
        return res.json({ message: "Loggin successful", token, username: user.username, userId: user._id })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ status: 500, message: "Interal Server Error" })
    }
}

const getUser = async (req, res) => {
    const userId = req.params.userId
    try {
        const result = await db.collection('users').findOne({ _id: userId })
        if (!result) {
            return res.status(404).json({ message: 'User not found' })
        }
        return res.status(200).json({ message: 'User found', result })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ status: 500, message: 'Internal Server Error' })
    }
};

const getFavorites = async (req, res) => {
    const userId = req.params.userId

    try {
        const userFavorites = await db.collection("users").findOne({ _id: userId }, { favorites: 1 })

        if (!userFavorites) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json({ favorites: userFavorites.favorites })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
};

const updateUserProfile = async (req, res) => {
    const { userId } = req.params
    const { profilePicture, bio } = req.body

    if (!profilePicture || !bio) {
        return res.status(400).json({ status: 400, message: "Missing profile picture or bio" })
    }

    try {
        const result = await db.collection("users").updateOne(
            { _id: userId },
            { $set: { profilePicture, bio } }
        );

        if (result.modifiedCount === 1) {
            res.status(200).json({ status: 200, message: "User profile updated successfully." })
        } else {
            res.status(404).json({ status: 404, message: "User not found." })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "Internal server error." })
    }
}

const postReview = async (req, res) => {
    const { gameId } = req.params;
    const { reviewText, userId, name, type } = req.body

    const reviewId = uuid()

    try {
        const newReview = {
            reviewId,
            gameId,
            reviewText,
            name,
            type
        }

        const user = await db.collection("users").findOne({ _id: userId })
        if (user.reviews.some(review => review.gameId === gameId)) {
            return res.status(400).json({ status: 400, message: "User has already posted a review for this game" })
        }
        const result = await db.collection("users").updateOne(
            { _id: userId },
            { $push: { reviews: newReview } }
        )
        if (result.modifiedCount === 1) {
            res.status(200).json({ status: 200, message: "Review added successfully" })
        } else {
            res.status(400).json({ status: 400, message: "Failed to add review" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "Internal server error." })
    }
}

const getReviewsForSpecificGame = async (req, res) => {
    const { gameId } = req.params;

    try {
        const reviews = await db.collection("users").find({
            "reviews.gameId": gameId
        }).project({
            _id: 1,
            username: 1,
            profilePicture: 1,
            reviews: {
                $elemMatch: { gameId: gameId }
            }
        }).toArray();

        res.status(200).json({ reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "Internal server error." });
    }
}

const deleteReview = async (req, res) => {
    const { reviewId, userId } = req.body

    try {
        const user = await db.collection("users").findOne({ _id: userId })

        const updatedReviews = user.reviews.filter(review => review.reviewId !== reviewId)

        const result = await db.collection("users").updateOne(
            { _id: userId },
            { $set: { reviews: updatedReviews } }
        );

        if (result.modifiedCount === 1) {
            res.status(200).json({ status: 200, message: "Review deleted successfully" })
        } else {
            res.status(400).json({ status: 400, message: "Failed to delete review" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ status: 500, message: "Internal server error" })
    }
}

const editReview = async (req, res) => {
    const { reviewId, userId, newReviewText } = req.body

    try {
        const user = await db.collection("users").findOne({ _id: userId })
        
        const reviewToUpdate = user.reviews.find(review => review.reviewId === reviewId)

        if (!reviewToUpdate) {
            res.status(400).json({ status: 400, message: "Review not found" });
            return
        }
        if (!user) {
            res.status(400).json({ status: 400, message: "User not found" });
            return;
        }

        reviewToUpdate.reviewText = newReviewText

        const result = await db.collection("users").updateOne(
            { _id: userId },
            { $set: { reviews: user.reviews } }
        )

        if (result.modifiedCount === 1) {
            res.status(200).json({ status: 200, message: "Review updated successfully" })
        } else {
            res.status(400).json({ status: 400, message: "Failed to update review" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ status: 500, message: "Internal server error" })
    }
}

express()
    .use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Methods",
            "OPTIONS, HEAD, GET, PUT, POST, DELETE"
        );
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept"
        );
        next();
    })
    .use(morgan("dev"))
    .use(express.static("./server/assets"))
    .use(express.json())
    .use(cors(corsOptions))
    .use(express.urlencoded({ extended: false }))
    .use("/", express.static(__dirname + "/"))
    .use('/assets', express.static('assets'))

    //endpoints

    .post("/user", createUser)
    .post("/login", login)
    .get("/user/:userId", getUser)
    .post("/users/updateFavorites", updateFavorites)
    .get("/user/:userId/favorites", getFavorites)
    .put("/user/:userId", updateUserProfile)
    .post("/reviews/:gameId", postReview)
    .get("/reviews/:gameId", getReviewsForSpecificGame)
    .delete("/reviews/delete-review", deleteReview)
    .patch("/reviews/edit-review", editReview)
    .listen(PORT, () => console.info(`Listening on port ${PORT}`))