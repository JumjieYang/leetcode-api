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

interface CodeSnippet {
  lang: string;
  langSlug: string;
  code: string;
}

interface TopicTag {
  name: string;
  slug: string;
}

enum SubmissionStatus {
  'Accepted',
  'Compile Error',
  'Wrong Answer',
  'Time Limit Exceeded',
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
  SubmissionStatus,
};
