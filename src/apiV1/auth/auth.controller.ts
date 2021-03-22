import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import * as jwt from 'jwt-then';
import * as _ from 'lodash';
import config from '../../config/config';
import User from '../users/user.model';
import { validateLoginInput } from '../validation/validateLogin';
import sendResetEmail from '../services/nodemailer';
import verifyRefreshToken from '../../helpers/verifyRefreshToken';


export default class UserController {

  public authenticate = async (req: Request, res: Response): Promise<any> => {
    const { email, password }  = req.body;
    const { errorMessage, isValid } = validateLoginInput({ email, password });
    
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: errorMessage
      });
    } 

    try {
      const user:any = await User.findOne({ email: req.body.email });
      
      if (!user) {
        return  res.status(404).json({
          success: false,
          message: 'Invalid Username or Password'
        });
      }

      const matchPasswords = await bcrypt.compare(password, user.password);
      console.log(matchPasswords)
      if (!matchPasswords) {
        return res.status(404).json({
          success: false,
          message: 'Invalid Username or Password'
        });
      }

      const accessToken = await jwt.sign({ email }, config.ACCESS_TOKEN_SECRET, {
        expiresIn: '30s'
      });

      const refreshToken = await jwt.sign({ email }, config.REFRESH_TOKEN_SECRET, {
        expiresIn: '1y'
      });

      res.status(200).send({
        success: true,
        message: 'Token generated Successfully',
        data: { accessToken, refreshToken}
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.toString()
      });
    }
  };

  public refreshTokens = async (req: Request, res: Response): Promise<any> =>{

    try{
      const { refreshToken } = req.body

      if (!refreshToken) {
        res.status(400).send({
          success: false,
          message: 'Refresh Token Not Sent'
        });
      }

      const email = await verifyRefreshToken(refreshToken)

      if(!email){
        res.status(400).send({
          success: false,
          message: 'Unauthorized'
        })
      }

      const accessToken = await jwt.sign({ email }, config.ACCESS_TOKEN_SECRET, {
        expiresIn: '30s'
      });

      const refToken = await jwt.sign({ email }, config.REFRESH_TOKEN_SECRET, {
        expiresIn: '1y'
      });

      res.status(200).send({
        success: true,
        message: 'Token generated Successfully',
        data: { accessToken: accessToken, refreshToken: refToken }
      });

    }catch(err){
      res.status(500).send({
        success: false,
        message: err.toString()
      });
    }
    
  }

  public register = async (req: Request, res: Response): Promise<any> => {
    let { firstName, lastName, role, email, password } = req.body;

    //check if user(email) already exists
    const user:any = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    //check if the password is more than 8 chars
    if(password.length < 8){
      return res.status(400).json({
        success: false,
        message: 'Password must be 8 characters or more'
      });
    }
    try {
      //const hash = await bcrypt.hash(password, config.SALT_ROUNDS);
      const hash = async (text, size) => {
        try {
          const salt = await bcrypt.genSalt(size);
          const hash = await bcrypt.hash(text, salt);
          return hash
        } catch (error) {
          console.log(error)
        }
      }

      let genHash = await hash(password, config.SALT_ROUNDS)
      
      const user = new User({
        firstName,
        lastName,
        role,
        email,
        password: genHash
      });

      const newUser = await user.save();

      res.status(201).send({
        success: true,
        message: 'User Successfully created',
        data: newUser
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.toString()
      });
    }
  };

  public forgotPassword = async (req: Request, res: Response): Promise<any> => {
    const { email } = req.body;
    const clientUrl = "http://localhost:3000" ;

    try {
      const user:any = await User.findOne({ email });
      
      if(!user){
        return res.status(400).json({
          success: false,
          message: 'User with Email does not exist'
        });
      }

      const token = await jwt.sign({ _id: user._id }, config.FORGOT_PASSWORD_ENCRYPTION, {
        expiresIn: config.JWT_EXPIRATION
      });

      user.updateOne({ resetLink: token }, (err, success) =>{
        if(err){
          return res.status(400).json({
            success: false,
            message: 'Reset password link error'
          }); 
        }
      })

    var response = await sendResetEmail(email, clientUrl, token)
    //console.log(response)
    res.status(200).send(response)
    }catch (err) {
      res.status(500).json({
        success: false,
        message: err.toString()
      });
    }
  };

  public resetPassword = async (req: Request, res: Response): Promise<any> => {
    const { resetLink, newPass } = req.body ;
    if(!resetLink){
      return res.status(400).json({
        success: false,
        message: 'No token provided'
      })
    }

    const decodedData = await jwt.verify(resetLink, config.FORGOT_PASSWORD_ENCRYPTION) ;
    if(!decodedData._id){
      return res.status(400).json({
        success: false,
        message: 'Incorrect or expired token'
      })
    }

    let user = await User.findOne({resetLink: resetLink, _id: decodedData._id})

    if(!user){
      return res.status(400).json({
        success: false,
        message: 'User with this token does not exist'
      })
    }

    const hash = async (text, size) => {
      try {
        const salt = await bcrypt.genSalt(size);
        const hash = await bcrypt.hash(text, salt);
        return hash
      } catch (error) {
        console.log(error)
      }
    }

    let passHash = await hash(newPass, config.SALT_ROUNDS)
    const obj = {
      password: passHash,
      resetLink: ''
    }

    user = _.extend(user, obj);

    var result = await user.save();

    if(!result){
      return res.status(400).json({
        success: false,
        message: 'Reset Password error'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Your password has been changed'
    })
  }
}
