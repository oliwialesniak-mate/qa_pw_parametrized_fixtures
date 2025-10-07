import { test } from '../../_fixtures/fixtures';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { generateNewArticleData } from '../../../src/common/testData/generateNewArticleData';
import { HomePage } from '../../../src/ui/pages/HomePage';

test.use({ contextsNumber: 3, usersNumber: 3 });

test('User can see in feed articles from two different users', async ({
  pages,
  users,
  logger,
}) => {
  // Sign up and log in three users, each on a separate page
  await signUpUser(pages[0], users[0]);
  await signUpUser(pages[1], users[1]);
  await signUpUser(pages[2], users[2]);

  // Users 1 and 2 each create a unique article
  const article1 = generateNewArticleData(logger);
  article1.title += ' by user1';
  await createArticle(pages[0], article1);

  const article2 = generateNewArticleData(logger);
  article2.title += ' by user2';
  await createArticle(pages[1], article2);

  // Third user views home feed
  const homePageUser3 = new HomePage(pages[2]);
  await homePageUser3.open();

  // Verify both articles are visible in user3's feed
  await homePageUser3.assertArticleVisible(article1.title, users[0].username);
  await homePageUser3.assertArticleVisible(article2.title, users[1].username);
});
