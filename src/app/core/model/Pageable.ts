import { SortPage } from '../../author/model/SortPage';

export class Pageable {
    pageNumber: number;
    pageSize: number;
    sort: SortPage[];
}
