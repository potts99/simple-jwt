  
require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())

// DO NOT DO THIS IN PRODUCTION
let refreshTokens = []

app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if(refreshToken === null) return res.sendStatus(401)
    if(!refreshTokens.includes(refreshToken)) return sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return sendStatus(403)
        const accessToken = genAccessToken({ name: user.name})
        res.json(accessToken)
    })
})

app.post('/login', (req, res) => {
    // user auth

    const username = req.body.username

    const user = {name: username}

    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)

    const accessToken = genAccessToken(user)
    refreshToken.push(refreshTokens)
    res.json({ 
        accessToken: accessToken,
        refreshToken: refreshToken
    })
})

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
  })

function genAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s'})
}

app.listen(3001)

