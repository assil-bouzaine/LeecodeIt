import { LeetCode, Credential } from 'leetcode-query';

async function submitAndCheck(problemSlug, code, lang = 'python3') {
  // Initialize credential (using your LEETCODE_SESSION from .env)
  const cred = new Credential();
  await cred.init(process.env.SESSION, process.env.CSRF);

  const lc = new LeetCode(cred);

  // Submit the solution
  const submission = await lc.submit({
    titleSlug: problemSlug,
    lang,
    code,
  });

  const subId = submission.submissionId;
  console.log(`Submitted! Submission ID: ${subId}`);

  // Polling until we get a final result
  let detail;
  while (true) {
    detail = await lc.submission(subId);
    if (['AC', 'Accepted', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded'].includes(detail.status)) {
      break;
    }
    await new Promise(res => setTimeout(res, 2000)); // 2s delay between checks
  }

  console.log(`Result: ${detail.status}`);
  return detail.status === 'Accepted' || detail.status === 'AC';
}

// Usage
submitAndCheck('two-sum', `
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        looked = {}
        for i, n in enumerate(nums):
          if target - n in looked:
            return [looked[target-n], i]
          looked[n] = i
`, 'python3')
  .then(isAccepted =>
    console.log(isAccepted ? '✅ Accepted!' : '⏳ Not accepted')
  )
  .catch(console.error);

