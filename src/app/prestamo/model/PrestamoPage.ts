import { Pageable } from "../../core/model/Pageable";
import { Prestamo } from "./Prestamo";

export class PrestamoPage {
    content: Prestamo[];
    pageable: Pageable;
    totalElements: number;
}
