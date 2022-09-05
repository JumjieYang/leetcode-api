import ApiCaller from '../utils/apicaller';

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

  async getAllProblems(
    slug: string,
    filter: object,
    limit: number,
    skip: number
  ) {
    return await this.apiCaller.GraphQLRequest({
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
          acRate
          difficulty
          freqBar
          frontendQuestionId: questionFrontendId
          isFavor
          paidOnly: isPaidOnly
          status
          title
          titleSlug
          topicTags {
            name
            id
            slug
          }
          judgeType
          hasSolution
          hasVideoSolution
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
    });
  }

  async getProblemDetail(titleSlug: string) {
    return await this.apiCaller.GraphQLRequest({
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
          stats
          solution {
            id
            canSeeDetail
            paidOnly
            hasVideoSolution
            paidOnlyVideo
          }
          status
          sampleTestCase
        }
      }
      `,
      variables: {
        titleSlug: titleSlug,
      },
    });
  }

  async testSolution(
    slug: string,
    data_input: string,
    judgeType: string,
    lang: string,
    question_id: string,
    typed_code: string
  ) {
    return await this.apiCaller
      .HttpRequest({
        method: 'POST',
        url: `https://leetcode.com/problems/${slug}/interpret_solution/`,
        body: {
          data_input: data_input,
          judgeType: judgeType,
          lang: lang,
          question_id: question_id,
          typed_code: typed_code,
        },
      })
      .then(async res => {
        return await this.apiCaller.HttpRequest({
          method: 'GET',
          url: `https://leetcode.com/submissions/detail/${res.data.interpret_id}/check`,
        });
      });
  }

  async submitSolution(
    slug: string,
    lang: string,
    question_id: string,
    typed_code: string
  ) {
    return await this.apiCaller
      .HttpRequest({
        method: 'POST',
        url: `https://leetcode.com/problems/${slug}/submit/`,
        body: {
          lang: lang,
          question_id: question_id,
          typed_code: typed_code,
        },
      })
      .then(async res => {
        return await this.apiCaller.HttpRequest({
          method: 'GET',
          url: `https://leetcode.com/submissions/detail/${res.data.submission_id}/check`,
        });
      });
  }
}

export default ProblemManager;
