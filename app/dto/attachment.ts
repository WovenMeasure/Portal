export class Attachments {

    FileName: string;
    MediaType: string;
    ImageDataBase64: string;


    constructor() { }

    public Attachments(_fileName: string, _mediaType: string, _imageDataBase64: string) {
        this.FileName = _fileName;
        this.MediaType = _mediaType;
        this.ImageDataBase64 = _imageDataBase64;
    }


}