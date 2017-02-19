export class QuestAnswer {

    QuestionId: any;
    QuestionAnswerIds: any[];
    FreeFormAnswer: any;


    constructor() { }

    public QuestAnswer(_QuestionId: any, _QuestionAnswerIds: any[], _FreeFormAnswer: any) {
        this.QuestionId = _QuestionId;
        this.QuestionAnswerIds = _QuestionAnswerIds;
        this.FreeFormAnswer = _FreeFormAnswer;
    }

}


