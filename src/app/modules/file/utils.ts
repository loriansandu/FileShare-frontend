import {formatDistanceToNow, parseISO} from 'date-fns';

export function getFileSize(bytes: number | undefined): string {
  if(bytes) {
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const sizeInFormattedUnit = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    return `${sizeInFormattedUnit} ${sizes[i]}`;
  }
  else {
    return '0 Bytes';
  }

}

export function getFileExtension(fileName: string | undefined): string {
  if(fileName) {
    const dotIndex = fileName.lastIndexOf('.');
    if (dotIndex !== -1 && dotIndex < fileName.length - 1) {
      return fileName.substring(dotIndex + 1).toLowerCase();
    }
  }
  return '';
}

export function formatUploadDate(uploadDate: string): string {
  const formattedDate = parseISO(uploadDate);
  return formatDistanceToNow(formattedDate, { addSuffix: true });
}

export function daysUntilSelectedDate(selectedDate: string | undefined): string {
  // Get the current date
  if(selectedDate) {
    const expireDate = new Date(selectedDate);
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = expireDate.getTime() - currentDate.getTime();

    // Calculate the difference in days
    const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));

    // Return a formatted string
    if (differenceInDays === 0) {
      return 'Today';
    } else if (differenceInDays === 1) {
      return 'Tomorrow';
    } else if (differenceInDays < 0) {
      return `${-differenceInDays} days ago`;
    } else {
      return `in ${differenceInDays} days`;
    }
  }
  else {
    return ''
  }
}


