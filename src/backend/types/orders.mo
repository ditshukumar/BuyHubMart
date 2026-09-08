module {
  public type OrderItem = {
    productId : Nat;
    title : Text;
    imageUrl : Text;
    quantity : Nat;
    sellingPrice : Float;
  };

  public type Order = {
    id : Text;
    supplier : Text;
    customerName : Text;
    phone : Text;
    address : Text;
    pincode : Text;
    paymentMethod : Text;
    paymentStatus : Text;
    orderStatus : Text;
    supplierStatus : Text;
    supplierOrderId : Text;
    trackingNumber : Text;
    items : [OrderItem];
    subtotal : Float;
    shipping : Float;
    total : Float;
    createdAt : Int;
    updatedAt : Int;
  };
};
