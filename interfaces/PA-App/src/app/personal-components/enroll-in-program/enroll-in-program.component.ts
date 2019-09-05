import { Component } from '@angular/core';
import { PersonalComponent } from '../personal-component.interface';

import { ProgramsServiceApiService } from 'src/app/services/programs-service-api.service';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { ConversationService } from 'src/app/services/conversation.service';

import { Program } from 'src/app/models/program.model';

@Component({
  selector: 'app-enroll-in-program',
  templateUrl: './enroll-in-program.component.html',
  styleUrls: ['./enroll-in-program.component.scss'],
})
export class EnrollInProgramComponent implements PersonalComponent {
  public languageCode: string;

  public program: any;
  public programTitle: string;
  public introductionText: string;

  public questions: any;
  public answerTypes = AnswerType;

  public answers: any = {};

  public hasAnswered: boolean;

  constructor(
    public programsService: ProgramsServiceApiService,
    public storage: Storage,
    public translate: TranslateService,
    public conversationService: ConversationService,
  ) { }

  ngOnInit() {
    this.getLanguageChoice();
    this.getProgramDetails();
  }

  private getLanguageChoice() {
    this.storage.get('languageChoice').then(value => {
      this.languageCode = value;
    });
  }

  private getProgramDetails() {
    this.storage.get('programChoice').then(value => {
      this.getProgramDetailsById(value);
    });
  }

  public getProgramDetailsById(programId: string) {
    this.programsService.getProgramById(programId).subscribe((response: Program) => {

      this.programTitle = response.title[this.languageCode];
      this.introductionText = this.translate.instant('personal.enroll-in-program.introduction', {
        programTitle: this.programTitle,
      });

      this.buildDetails(response, this.languageCode);
      this.buildQuestions(response.customCriteria, this.languageCode);
    });
  }

  private buildDetails(response: Program, languageCode: string) {
    const details = [
      'ngo',
      'description',
      'distributionChannel',
    ];
    this.program = [];
    for (const detail of details) {
      this.program[detail] = response[detail][languageCode] ? response[detail][languageCode] : response[detail];
    }
  }

  private buildQuestions(customCriteria: Program['customCriteria'], languageCode: string) {
    this.questions = [];

    for (const criterium of customCriteria) {
      const question: Question = {
        id: criterium.id,
        code: criterium.criterium,
        answerType: criterium.answerType,
        label: criterium.label[languageCode],
        options: this.buildOptions(criterium.options, languageCode),
      };
      this.questions.push(question);
    }
  }

  private buildOptions(optionsRaw: any[], languageCode: string): QuestionOption[] {
    if (!optionsRaw) {
      return;
    }

    const options = [];

    for (const option of optionsRaw) {
      const questionOption: QuestionOption = {
        id: option.id,
        value: option.option,
        label: option.label[languageCode],
      };
      options.push(questionOption);
    }

    return options;
  }

  private getQuestionByCode(questionCode: string): Question {
    const result = this.questions.find((question: Question) => {
      return question.code === questionCode;
    });

    return result;
  }

  private getAnswerOptionLabelByValue(options: QuestionOption[], answerValue: string) {
    const option = options.find((item: QuestionOption) => {
      return item.value === answerValue;
    });

    return option ? option.label : '';
  }

  public changeAnswers($event) {
    const questionCode = $event.target.name;
    const answerValue = $event.target.value;

    const question = this.getQuestionByCode(questionCode);
    const answer: Answer = {
      code: questionCode,
      value: answerValue,
      label: answerValue,
    };

    // Convert the answerValue to a human-readable label
    if (question.answerType === AnswerType.Enum) {
      answer.label = this.getAnswerOptionLabelByValue(question.options, answerValue);
    }

    this.answers[questionCode] = answer;
  }

  public change() {
    console.log('change()');

  }

  public submit() {
    console.log('submit()');

    this.hasAnswered = true;
  }

  public submitConfirm() {
    console.log('submitConfirm()');

    this.complete();
  }

  getNextSection() {
    return 'select-appointment';
  }

  complete() {
    this.conversationService.onSectionCompleted({
      name: 'enroll-in-program',
      data: {
        program: this.program,
        questions: this.questions,
        answers: this.answers,
      },
      next: this.getNextSection(),
    });
  }
}

class Question {
  id: number;
  code: string;
  answerType: AnswerType;
  label: string;
  options: QuestionOption[];
}
enum AnswerType {
  // Translate the types used in the API to internal, proper types:
  Number = 'numeric',
  Text = 'text',
  Enum = 'dropdown',
}
class QuestionOption {
  id: number;
  value: string;
  label: string;
}
class Answer {
  code: string;
  value: string;
  label: string;
}