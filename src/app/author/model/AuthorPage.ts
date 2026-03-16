import { Pageable } from "../../core/model/Pageable";
import { Author } from "./Author";

export class AuthorPage {
    content: Author[];
    pageable: Pageable;
    totalElements: number;
}
