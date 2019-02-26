import { formatErrors } from '../utils/formatErrors'
import requiresAuth from '../middlewares/authentication'
import sendgridTransport from 'nodemailer-sendgrid-transport'

import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

import Email from 'email-templates'

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.SENDGRID_API_KEY
  }
}))

export default {
  Query: {
    getInvitedUsers: requiresAuth.createResolver((parent, args, { models, subdomain }) => models.Invitation.findAll({ searchPath: subdomain }))
  },

  Mutation: {
    sendInvitation: requiresAuth.createResolver(async (parent, args, { models, subdomain, user }) => {
     
      let emailToken

      try {
        // Create emailToken
        emailToken = jwt.sign({
          email: args.email,
          account: subdomain
        }, process.env.JWTSECRET1, { expiresIn: '60d' })
      } catch(err) {
        console.log('err', err)
      }

      const url = `http://${subdomain}.lvh.me:3000/signup/invitation/?token=${emailToken}`
      
      const email = new Email({
        message: {
          from: 'no-replay@email.toolsio.com'
        },
        // uncomment below to send emails in development/test env:
        send: true,
        // transport: {
        //   jsonTransport: true
        // }
        transport: transporter
      })

      return email
        .send({
          template: 'user_invitation',
          message: {
            to: args.email,
            subject: 'Complete your Registration (Toolsio)'
          },
          locals: {
            account: subdomain,
            email: args.email,
            inviter: user.firstName,
            invitationLink: url,
          }
        })
        .then(res => {
          console.log('User invitation success: ', res)

          models.Invitation.create({email: args.email, userId: user.id}, { searchPath: subdomain })
          .then(res => console.log('Invitation create success: ', { message: res.message, from: res.originalMessage.from, 
            to: res.originalMessage.to, subject: res.originalMessage.subject, text: res.originalMessage.text } ))
            .catch(err => {
              console.log('Invitation create err: ', err)
              return {
                success: false,
                errors: formatErrors(err, models)
              }
            })

          // Retrun success true to client on success
          return {
            success: true
          }
        })
        .catch(err => {
          console.log('User invitation success: ', err)
          return {
            success: false, 
            errors: err
          }
        })          
    })
    
  }    
}