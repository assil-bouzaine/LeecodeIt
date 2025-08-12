import LeetCode from 'leetcode-query';

export async function getEasyProblems() {
  const lc = new LeetCode();

  const result = await lc.problems({
    filters: { difficulty: "EASY" }, // filter by difficulty
    limit: 890, // max results to fetch
    offset: 0  // start from first problem
  });


  return result.questions.map(p => ({
    title: p.title,
    slug: p.titleSlug,
  }));
  //  console.log(`Total easy problems: ${result.total}`);

}

