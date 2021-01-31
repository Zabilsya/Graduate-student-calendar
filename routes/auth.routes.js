const {Router} = require('express')
const router = Router()

router.post('/login', async (request, response) => {
    try {

    } catch (e) {
        response.status(500).json({message: "Ошибка! Попробуйте снова"})
    }
})

module.exports = router;