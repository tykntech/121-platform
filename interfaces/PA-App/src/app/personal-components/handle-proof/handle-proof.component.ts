import { Component } from '@angular/core';

import { ConversationService } from 'src/app/services/conversation.service';
import { PaDataService } from 'src/app/services/padata.service';
import { UpdateService } from 'src/app/services/update.service';

import { SovrinService } from 'src/app/services/sovrin.service';
import { ProgramsServiceApiService } from 'src/app/services/programs-service-api.service';

import { PersonalComponent } from '../personal-component.class';

enum InclusionStates {
  included = 'included',
  excluded = 'excluded',
  unavailable = 'unavailable'
}

@Component({
  selector: 'app-handle-proof',
  templateUrl: './handle-proof.component.html',
  styleUrls: ['./handle-proof.component.scss'],
})
export class HandleProofComponent extends PersonalComponent {

  public ngo: string;

  private programId: number;
  private did: string;
  private wallet: any;

  public inclusionStatus: string;
  public inclusionStatusPositive = false;
  public inclusionStatusNegative = false;

  constructor(
    public conversationService: ConversationService,
    public paData: PaDataService,
    public updateService: UpdateService,
    public programService: ProgramsServiceApiService,
    public sovrinService: SovrinService,
  ) {
    super();

    this.conversationService.startLoading();
  }

  ngAfterContentInit() {
    this.handleProof();
  }

  async handleProof() {
    console.log('handleProof');

    await this.gatherData();
    this.ngo = this.paData.myPrograms[this.programId].ngo;

    // Create proof
    const proofRequest = await this.programService.getProofRequest(this.programId);
    const proof = await this.sovrinService.getProofFromWallet(proofRequest, this.wallet);

    // Use proof
    const status = await this.programService.includeMe(this.did, this.programId, proof);

    if (status === 'done') {
      this.inclusionStatus = await this.programService.checkInclusionStatus(this.did, this.programId);
    }

    if (this.inclusionStatus === InclusionStates.included) {
      this.inclusionStatusPositive = true;
    } else if (this.inclusionStatus === InclusionStates.excluded) {
      this.inclusionStatusNegative = true;
    }

    this.conversationService.stopLoading();
  }

  private async gatherData() {
    this.programId = Number(await this.paData.retrieve(this.paData.type.programId));
    this.did = await this.paData.retrieve(this.paData.type.did);
    this.wallet = await this.paData.retrieve(this.paData.type.wallet);
  }
}
