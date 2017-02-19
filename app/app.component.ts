import {Component, ViewChild} from '@angular/core';
import { ContextService } from './common/services/context-service';
import { ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';
@Component({
    selector: 'laz',
    templateUrl: 'app.tmpl.html'
})
export class AppComponent {
    constructor(private contextService: ContextService) {

    }    
}
  