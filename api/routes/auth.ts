import { IUser, User } from '@duchynko/tipovacka-models';
import bcrypt from 'bcryptjs';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import { isLoggedIn } from '../utils/authMiddleware';
import logger from '../utils/logger';

const router = express.Router();

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`[${req.method}] ${req.baseUrl}${req.path} from ${req.ip}.`);

  // If req.headers contains the admin key, continue
  if (isLoggedIn(req)) {
    next();
  } else {
    logger.warn(
      `[${req.originalUrl}] Unauthorized request was made by user ${
        req.user && (req.user as IUser & { _id: string })._id
      } from IP: ${req.ip}.`
    );
    res.status(401).send('Unauthorized request');
  }
};

router.get('/user', (req, res) => {
  logger.info(`[${req.method}] ${req.baseUrl}${req.path} from ${req.ip}.`);
  let user = req.user;

  // For some reason, when submiting a bet in production, the requests arrive
  // with the scorer field as a string. E.g., instead 256, the value is "256".
  // This is a quick workaround to make sure we always return back scorers
  // as numbers, until the root problem is fixed.
  if (user) {
    let user = req.user as IUser;
    user.bets = user.bets!.map((bet) => {
      if (typeof bet.scorer === 'string') {
        bet.scorer = parseInt(bet.scorer);
      }
      return bet;
    });
  }

  res.status(200).send(user);
});

router.get('/logout', (req, res) => {
  logger.info(`[${req.method}] ${req.baseUrl}${req.path} from ${req.ip}.`);
  req.session?.destroy(async (err) => {
    if (err) {
      logger.info(
        `Couldn't destory session ${req.sessionID} for a user ${req.user}. Error: ${err}`
      );
    }

    const Sessions = mongoose.connection.collection('sessions');
    await Sessions.findOneAndDelete({ _id: req.sessionID }).catch((err) => {
      logger.warn(
        `Couldn't delete sessions ${req.sessionID} from the database. Error: ${err}`
      );
    });
  });
  req.logout();
  res.status(200).send();
});

router.post('/login', passport.authenticate('local'), function (req, res) {
  logger.info(`[${req.method}] ${req.baseUrl}${req.path} from ${req.ip}.`);
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  res.status(200).send('Login successfull.');
});

// router.post('/register', async (req, res) => {
//   const { username, email, password, groupId } = req.body;

//   try {
//     validateInput(req.body);

//     const user = await User.findOne({ email });
//     if (user) {
//       res.status(400).send('User with this email already exists');
//       return;
//     }

//     const salt = await bcrypt.genSalt();
//     const encryptedPassword = await bcrypt.hash(password, salt);

//     const newUser = await User.create({
//       email,
//       username,
//       groupId,
//       password: encryptedPassword,
//     });
//     logger.info(
//       `A new user ${newUser.email} (${newUser._id}) has been created in group ${newUser.groupId}`
//     );

//     res.status(200).send(newUser);
//   } catch (error) {
//     if (error instanceof (ValidationError || PropertyRequiredError)) {
//       // Logging handled in validateInput
//       res.status(400).send(error.message);
//     } else {
//       logger.error(`Error while registering a user.`);
//       logger.error(`Error: ${error}.`);
//       res.status(500).send('Internal error');
//     }
//   }
// });

router.post('/password', authMiddleware, async (req, res) => {
  const { oldPassword, newPassword, confirmedPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmedPassword) {
    res.status(400).send('Not all values were provided.');
    return;
  }

  if (newPassword !== confirmedPassword) {
    res.status(400).send("New passwords doesn't match.");
    return;
  }

  try {
    const user = await User.findById((req.user as any)._id);

    if (!user) {
      return res.status(404).send("User doesn't exist");
    }

    const passwordsMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordsMatch) {
      res.status(400).send('Wrong password');
      return;
    }

    const salt = await bcrypt.genSalt();
    const newEncryptedPassword = await bcrypt.hash(newPassword, salt);
    user.password = newEncryptedPassword;
    await user.save();

    logger.info(`Password for a user ${user.email} (${user._id}) was changed.`);

    res.status(200).send();
  } catch (error) {
    res.status(500).send('Internal error');
  }
});

export default router;
