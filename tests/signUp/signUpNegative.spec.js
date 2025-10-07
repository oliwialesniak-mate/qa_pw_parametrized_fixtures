import { test } from '../_fixtures/fixtures';
import {
  EMPTY_EMAIL_MESSAGE,
  EMPTY_PASSWORD_MESSAGE,
  EMAIL_ALREADY_TAKEN_MESSAGE,
  INVALID_EMAIL_MESSAGE,
} from '../../src/ui/constants/authErrorMessages';
import { generateNewUserData } from '../../src/common/testData/generateNewUserData';
import { signUpUser } from '../../src/ui/actions/auth/signUpUser';

const user = generateNewUserData();

const testParameters = [
  {
    email: '',
    password: user.password,
    message: EMPTY_EMAIL_MESSAGE,
    title: 'empty email',
  },
  {
    email: user.email,
    password: '',
    message: EMPTY_PASSWORD_MESSAGE,
    title: 'empty password',
  },
  {
    email: 'invalid-email',
    password: user.password,
    message: INVALID_EMAIL_MESSAGE,
    title: 'invalid email format',
  },
  {
    email: user.email,
    password: user.password,
    message: EMAIL_ALREADY_TAKEN_MESSAGE,
    title: 'existing email',
    precondition: true, // sign up first to trigger duplicate
  },
];

testParameters.forEach(({ email, password, message, title, precondition }) => {
  test.describe('Sign up negative tests', () => {
    test(`Sign up with ${title}`, async ({ signUpPage, page, logger }) => {
      if (precondition) {
        await signUpUser(page, user, logger);
      }

      await signUpPage.open();
      await signUpPage.fillEmailField(email);
      await signUpPage.fillPasswordField(password);
      await signUpPage.clickSignUpButton();
      await signUpPage.assertErrorMessageContainsText(message);
    });
  });
});
