import { Credential, LeetCode } from 'leetcode-query';
import dotenv from 'dotenv';

dotenv.config();

export async function listSolvedProblems() {
  const sessionCookie = process.env.SESSION;
  const csrf = process.env.CSRF;

  if (!sessionCookie || !csrf) {
    throw new Error('SESSION or CSRF not set in .env');
  }

  const credential = new Credential();
  await credential.init(sessionCookie, csrf);

  const lc = new LeetCode(credential);

  const userInfo = await lc.whoami();
  // console.log(`Logged in as username: ${userInfo.username}`);

  const result = await lc.problems({
    filters: { difficulty: 'EASY' }, // can remove difficulty to get all
    limit: 890,
    offset: 0
  });

  const solvedProblemTitles = result.questions
    .filter(p => p.status === 'ac')
    .map(p => p.title);

  //  console.log(`You have solved ${solvedProblemTitles.length} problems.`);
  // console.log(solvedProblemTitles);
  return solvedProblemTitles;
}

listSolvedProblems().catch(console.error);

