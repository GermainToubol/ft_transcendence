import LocalFile from "src/localfiles/localFile.entity";

export interface playerInterface {
	id: number;
	usual_full_name: string;
	avatar: LocalFile;
}