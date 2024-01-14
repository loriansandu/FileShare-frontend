import { CommonModule } from '@angular/common';
import {ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router, RouterOutlet} from "@angular/router";
import {FileService} from "../../../services/file.service";
import {HttpErrorResponse, HttpEvent, HttpEventType} from "@angular/common/http";
import { saveAs } from 'file-saver';
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {Tooltip} from "primeng/tooltip";
import {FileDetails} from "../models/FileDetails";
import {getFileSize, getFileExtension, daysUntilSelectedDate} from "../utils";
import {MessageService} from "primeng/api";

enum TransferState {
  UploadInProgress,
  UploadStopped,
  UploadSuccess,
  Download,
  Expired
}

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css'],
})

export class FileComponent implements OnInit{
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('textInput', { static: false }) textInput!: ElementRef;
  @ViewChild(Tooltip) tooltip!: Tooltip;
  MAXSIZEBYTES = 100 * 1024 * 1024;
  response!: any;
  selectedFile: File | undefined;
  loadedBytes: number = 0;
  totalBytes: number = 0;
  dragOver: boolean = false;
  showDeleteFileButton: boolean = false;
  percentDone: number = 0;
  startTime!: number;
  remainingTime = 'Calculating...';
  unsubscribeUpload = new Subject<void>();
  transferState! : TransferState;
  TransferStateEnum = TransferState;
  sidebarVisible2: boolean = false;
  // uploadResponse: FileDetails | undefined= {
  //   downloadCounter: 0, expirationDate: "", password: "",
  //   fileId: '',
  //   fileName: '',
  //   fileSize: 0,
  //   fileType: '',
  //   uploadDate: '',
  //   downloadURL : "google.ro"
  // };
  uploadResponse : FileDetails | undefined;
  downloadResponse: FileDetails | undefined;
  protected readonly formatFileSize = getFileSize;
  protected readonly getFileExtension = getFileExtension;
  fileExpirationOptions: string[] = ['7 days', '14 days', '28 days'];
  fileExpirationDays: string = '7 days';
  filePassword: string = '';
  fileLockedPassword: string = '';
  isDownloadedFileLocked!: boolean ;
  fileId!: string;
  constructor(private fileService: FileService,
              private route: ActivatedRoute,
              private router: Router,
              private messageService: MessageService,) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
       this.fileId = params['param']
      if(this.fileId) {
        this.fileService.checkLockedFile(this.fileId).subscribe(
          (response : any) => {
            this.transferState = TransferState.Download;
            this.isDownloadedFileLocked = response.message !== 'false'
             if(!this.isDownloadedFileLocked) {
               this.onGetFileInfo(this.fileId);
             }
          },
          (error) => {
            if(error.error.message.includes("File is expired")) {
              this.transferState = TransferState.Expired;
            }
            else if(error.error.message.includes("File not found")) {
              this.redirectToHome()
            }
          }
        )
      }
      else {
        this.transferState = this.TransferStateEnum.UploadStopped;
      }
    });

  }
  onSelectFile(event: any) : void {
    const file : File = event.target.files[0];
    this.selectedFile = this.checkFileSize(file);
  }

  checkFileSize(file : File) : File | undefined {
    if (file.size <= this.MAXSIZEBYTES) {
      return file;
    }
    else {
      this.messageService.add({
        severity: 'error',
        detail: 'File size exceeds the 100MB limit.',
      });
      return undefined;
    }
  }
  cancelUpload() {
    this.unsubscribeUpload.next();
    this.unsubscribeUpload.complete();
    this.percentDone = 0;
    this.transferState = TransferState.UploadStopped;
  }

  onUploadFiles(file: File, fileExpirationDays: string, filePassword: string): void {
    this.unsubscribeUpload = new Subject<void>();
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('expirationDays', fileExpirationDays.substring(0, fileExpirationDays.indexOf(' ')))
    formData.append('password', filePassword)
    this.startTime = Date.now();
    this.transferState = TransferState.UploadInProgress;
    this.fileService.upload(formData)
      .pipe(takeUntil(this.unsubscribeUpload))
      .subscribe(
      (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.loadedBytes = event.loaded;
          this.totalBytes = event.total;
          this.percentDone = Math.round((100 * event.loaded) / event.total);
          this.calculateRemainingTime();
        } else if (event.type === HttpEventType.Response) {
          this.transferState = TransferState.UploadSuccess;
          this.uploadResponse = event.body;
          this.selectedFile = undefined;
        }
      },
      (error) => {
        console.error('Error uploading file:', error);
        this.redirectToHome()
      }
    );
  }

  onGetFileInfo(fileId: string) {
    this.fileService.getFileInfo(fileId, this.fileLockedPassword).subscribe(
      response => {
        this.isDownloadedFileLocked = false;
        this.downloadResponse = response as FileDetails;
      },
      (error: HttpErrorResponse) => {
        if(error.error.message.includes("File is expired")) {
          this.transferState = TransferState.Expired;
        }
        else if(error.error.message.includes("not found")) {
          this.redirectToHome();
        }
        else if(error.error.message.includes("Wrong password")) {
          this.wrongPassword = true;
          this.fileLockedPassword = '';
        }
        else {
          this.redirectToHome();
        }
      }
    );
  }
  onDownloadFile(fileId: string): void {
    this.fileService.download(fileId).subscribe(
      response => {
        saveAs(new File([response.body!], response.headers.get('File-Name')!,
            {type: `${response.headers.get('Content-Type')};charset=utf-8`}));
      },
      (error: HttpErrorResponse) => {
        this.redirectToHome()
      }
    );
  }

  onDeleteFile(fileId: string): void {
    this.fileService.delete(fileId).subscribe(
      response => {
        this.uploadResponse = undefined;
      },
      (error: HttpErrorResponse) => {
        this.redirectToHome()
      }
    );
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    // event.stopPropagation();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
    const file = event.dataTransfer?.files.item(0);
    this.selectedFile = this.checkFileSize(file!);

  }
  onSelectAll() {
    this.textInput.nativeElement.select();
  }
  triggerInputClick() {
    this.fileInput.nativeElement.click();
  }

  deleteFile() {
    this.selectedFile = undefined;
  }

  calculateRemainingTime(): void {
    const elapsedTime = (Date.now() - this.startTime) / 1000; // elapsed time in seconds
    const averageSpeed = this.loadedBytes / elapsedTime; // average speed in bytes per second
    const remainingBytes = this.totalBytes - this.loadedBytes;
    const remainingTimeInSeconds = remainingBytes / averageSpeed;

    this.remainingTime = this.formatTime(remainingTimeInSeconds);
  }

  formatTime(seconds: number): string {
    const units = ['h', 'm', 's'];
    const timeValues = [
      Math.floor(seconds / 3600),
      Math.floor((seconds % 3600) / 60),
      Math.floor(seconds % 60)
    ];

    return timeValues
      .map((value, index) => (value > 0 || index === units.length - 1 ? `${value}${units[index]}` : ''))
      .filter(Boolean)
      .join(' ');
  }

  copyLink() {
    this.tooltip.activate();
    navigator.clipboard.writeText(this.textInput.nativeElement.value).then(() => {
    }).catch((error) => {
      console.error('Unable to copy text to clipboard', error);
    });
  }
  redirectToHome() {
    this.router.navigate(['/']);
  }
  resetValues() {
    this.selectedFile = undefined;
    this.filePassword = '';
    this.uploadResponse = undefined;
    this.transferState = TransferState.UploadStopped;
    this.fileExpirationDays = '7 days'
  }

  protected readonly daysUntilSelectedDate = daysUntilSelectedDate;
  protected readonly getFileSize = getFileSize;
  protected readonly FileState = TransferState;
  wrongPassword: boolean = false;

}
