const {Router} = require('express')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/User')
const router = Router()

router.post('/register',
    [
        check('email','Некорректный email').isEmail(),
        check('name','Некорректное имя').isUppercase(),
        check('secondName','Некорректная фамилия').isUppercase(),
        check('admissionYear', 'Некорректный год').isInt()
    ],
    async (req,res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при регистрации'
                })
            }

            const{email,name,secondName,thirdName,admissionYear} = req.body
            const candidate = await User.findOne({email})

            if (candidate){
                res.status(400).json({message: 'Такой пользователь уже существует'})
            }

            // generate password
            const randomstring = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomstring,12)

            const user = new User (
                { email: email
                    ,name: name
                    ,secondName: secondName
                    ,thirdName: thirdName
                    ,admissionYear: admissionYear
                    ,password: hashedPassword
                })
            await user.save()

            res.status(201).json({ message: 'Пользователь создан'})

        } catch (e) {
            res.status(500).json({message: "Ошибка! Попробуйте снова"})
        }
})


router.post('/login',
    [
        check('email','Некорректный email').normalizeEmail().isEmail(),
        check('password','Введите пароль').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при входе в систему'
                })
            }

            const{email,password} = req.body
           
            const user = await User.findOne({email})
            
            if (!user){
                console.log(user)
                return res.status(400).json({message: 'Пользователь не найден'})
            }
            
            const isMatch = await bcrypt.compare(password,user.password)

            if(!isMatch){
                return res.status(400).json({message: 'Неверный пароль, попробуйте снова'})
            }

            const token = jwt.sign(
                { userId: user.id},
                config.get('jwtSecret'),
                {expiresIn: '1h'}
            )

            return res.json({token,userId:user.id})

        } catch (e) {
            return res.status(500).json({message: "Ошибка! Попробуйте снова"})
        }
})

module.exports = router;