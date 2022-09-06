import ApiCaller from '../utils/apicaller';
import {
  ProblemDetail,
  ProblemsetQuestionList,
  SubmissionResult,
  TestResult,
} from '../utils/interfaces';

class ProblemManager {
  private apiCaller: ApiCaller;

  private static instance: ProblemManager;

  private constructor() {
    this.apiCaller = ApiCaller.getInstance();
  }

  static getInstance() {
    if (!ProblemManager.instance) {
      ProblemManager.instance = new ProblemManager();
    }

    return ProblemManager.instance;
  }

  async getProblems(
    slug: string,
    filter: object,
    limit: number,
    skip: number
  ): Promise<ProblemsetQuestionList> {
    return await this.apiCaller
      .GraphQLRequest({
        query: `
      query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
        problemsetQuestionList: questionList(
          categorySlug: $categorySlug
          limit: $limit
          skip: $skip
          filters: $filters
        ) {
          total: totalNum
          questions: data {
            difficulty
            paidOnly: isPaidOnly
            frontendQuestionId: questionFrontendId
            title
            titleSlug
            topicTags {
              name
              slug
            }
            judgeType
          }
        }
      }
        `,
        variables: {
          categorySlug: slug,
          filters: filter,
          limit: limit,
          skip: skip,
        },
      })
      .then(res => {
        return res.problemsetQuestionList;
      });
  }

  async getProblemDetail(titleSlug: string): Promise<ProblemDetail> {
    return await this.apiCaller
      .GraphQLRequest({
        query: `
      query questionData($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          questionId
          title
          titleSlug
          content
          isPaidOnly
          difficulty
          exampleTestcases
          topicTags {
            name
            slug
          }
          codeSnippets {
            lang
            langSlug
            code
          }
        }
      }
      `,
        variables: {
          titleSlug: titleSlug,
        },
      })
      .then(res => {
        return res.question;
      });
  }

  async testSolution(
    slug: string,
    data_input: string,
    judgeType: string,
    lang: string,
    question_id: string,
    typed_code: string
  ): Promise<TestResult> {
    return await this.apiCaller
      .HttpRequest({
        method: 'POST',
        url: `problems/${slug}/interpret_solution/`,
        body: {
          data_input: data_input,
          judgeType: judgeType,
          lang: lang,
          question_id: question_id,
          typed_code: typed_code,
        },
      })
      .then(async res => {
        return await this.apiCaller
          .HttpRequest({
            method: 'GET',
            url: `submissions/detail/${res.data.interpret_id}/check`,
          })
          .then(res => {
            return res.data;
          });
      });
  }

  async submitSolution(
    slug: string,
    lang: string,
    question_id: string,
    typed_code: string
  ): Promise<SubmissionResult> {
    return await this.apiCaller
      .HttpRequest({
        method: 'POST',
        url: `problems/${slug}/submit/`,
        body: {
          lang: lang,
          question_id: question_id,
          typed_code: typed_code,
        },
      })
      .then(async res => {
        return await this.apiCaller
          .HttpRequest({
            method: 'GET',
            url: `submissions/detail/${res.data.submission_id}/check`,
          })
          .then(res => {
            return res.data;
          });
      });
  }
}

export default ProblemManager;
