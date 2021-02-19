export interface Pay {
    uid?: string;
    id?: string;
    WompiPayId?: string;
    ReferenceId?: string;
    userUid?: string;
    empUid?: string;
    paymentMethod?: string;
    paymentMethodType?: string;
    customerData?: string;
    status?: string;
    dPrice?: number;
    total?: number;
    products?: Array<any>;
    direction?: string;
    deliveryDirections?: Array<any>;
    rating?: boolean;
    petData?: string;
    date?: string;
}
