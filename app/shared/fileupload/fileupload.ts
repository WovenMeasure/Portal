//our root app component
import {Component, Input, Output, EventEmitter} from '@angular/core';
import { ContextService } from '../../common/services/context-service';
import { LoggerService } from '../../common/services/logger-service';
import { SpinnerService } from '../../common/services/spinner-service';
import { ContextInfo } from '../../common/services/context-info';

@Component({
    selector: 'file-upload',
    templateUrl: 'fileupload.tmpl.html'
})

export class FileUploadComponent {
    constructor(private loggerService: LoggerService, private contextService: ContextService,
        private spinnerService: SpinnerService) { }

    currentUser: ContextInfo;

    @Input()
    base64Response: string;

    @Output()
    base64ResponseChange = new EventEmitter();

    @Input()
    fileName: string;

    @Output()
    fileNameChange = new EventEmitter();

    @Input()
    mimeType: string;

    @Output()
    mimeTypeChange = new EventEmitter();

    ngOnInit() {
        this.currentUser = this.contextService.ContextInfo;
    }

    reset() {
        $("#chooseFile").removeData(this.fileName);
        //$("#chooseFile").val(null);
    }

    filechosen($event): void {
        var self = this;
        console.log($event.target);
        var file = $event.target.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var buffer = reader.result;
            var binary = '';
            var bytes = new Uint8Array(buffer);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            var base64Content = window.btoa(binary);
            console.log(base64Content);
            self.base64ResponseChange.emit(base64Content);
            self.mimeTypeChange.emit(file.type);
            self.fileNameChange.emit(file.name);
        }
        reader.readAsArrayBuffer(file);
    }
}