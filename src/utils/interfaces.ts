interface HttpRequestOptions {
  method: string;
  url: string;
  referer?: string;
  body?: object;
}

interface GraphQLRequestOptions {
  origin?: string;
  referer?: string;
  query: string;
  variables?: object;
}

interface Credential {
  session: string;
  csrftoken: string;
}

interface Urls {
  base: string;
  graphql: string;
}

interface ProblemsetQuestionList {
  total: number;
  questions: Problem[];
}

interface Problem {
  difficulty: string;
  paidOnly: boolean;
  frontendQuestionId: string;
  title: string;
  slug: string;
  topicTags: TopicTag[];
  judgeType: string;
}

interface ProblemDetail {
  questionId: string;
  title: string;
  titleSlug: string;
  content: string;
  exampleTestCases: string;
  codeSnippets: CodeSnippet[];
}

interface TestResult {
  status_code: number;
  lang: string;
  run_success: boolean;
  runtime_error?: string;
  full_runtime_error?: string;
  status_runtime: string;
  memory: number;
  code_answer: string[];
  code_output: string[];
  std_output: string[];
  elapsed_time: number;
  task_finish_time: number;
  total_correct?: number;
  total_testcases?: number;
  runtime_percentile?: number;
  status_memory: string;
  memory_percentile?: number;
  pretty_lang: string;
  submission_id: string;
  status_msg: string;
  state: string;
}

interface SubmissionResult {
  status_code: number;
  lang: string;
  run_success: boolean;
  runtime_error?: string;
  full_runtime_error?: string;
  status_runtime: string;
  memory: number;
  question_id: string;
  elapsed_time: number;
  compare_result: string;
  code_output: string;
  std_output: string;
  last_testcase?: string;
  expected_output: string;
  task_finish_time: number;
  total_correct?: number;
  total_testcases?: number;
  runtime_percentile?: number;
  status_memory: string;
  memory_percentile?: number;
  pretty_lang: string;
  submission_id: string;
  status_msg: string;
  state: string;
}
interface CodeSnippet {
  lang: string;
  langSlug: string;
  code: string;
}

interface TopicTag {
  name: string;
  slug: string;
}

export {
  HttpRequestOptions,
  GraphQLRequestOptions,
  Credential,
  Urls,
  ProblemsetQuestionList,
  Problem,
  ProblemDetail,
  TopicTag,
  CodeSnippet,
  TestResult,
  SubmissionResult,
};
