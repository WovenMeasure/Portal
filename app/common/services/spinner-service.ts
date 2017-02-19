import { Injectable } from '@angular/core';

@Injectable()
export class SpinnerService {
    messages = [];

    postStatus(message : string) {
        this.messages.push(message);
        this.updateMessage();
    }

    finishCurrentStatus() {
        this.messages.splice(0, 1);
        this.updateMessage();
    }

    updateMessage() {
        if (this.messages.length === 0) {
            $(".spinner").hide();
            $(".spinner-message").text("");
        }
        else {
            $(".spinner-message").text(this.messages[0]);
            $(".spinner").css("opacity", "0");
            $(".spinner").show();
            $(".spinner-loader").css("margin-left", ($(".spinner-loader").width() / 2) * -1 + "px");
            $(".spinner").css("opacity", "0.75");
        }
    }

}