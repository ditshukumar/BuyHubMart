import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Types "../types/orders";

mixin (
  orders : Map.Map<Text, Types.Order>,
  nextOrderId : { var value : Nat },
  adminPrincipal : { var value : Principal },
) {
  func isAdmin(caller : Principal) : Bool {
    if (caller.isController()) return true;
    if (caller.isAnonymous()) return false;
    let stored = adminPrincipal.value;
    not stored.isAnonymous() and caller == stored
  };

  public shared func createOrder(
    customerName : Text,
    phone : Text,
    address : Text,
    pincode : Text,
    paymentMethod : Text,
    items : [Types.OrderItem],
    subtotal : Float,
    shipping : Float,
    total : Float,
  ) : async Types.Order {
    if (customerName.trim(#char ' ') == "") Runtime.trap("Customer name is required");
    if (phone.trim(#char ' ') == "") Runtime.trap("Phone is required");
    if (address.trim(#char ' ') == "") Runtime.trap("Address is required");
    if (pincode.trim(#char ' ') == "") Runtime.trap("PIN code is required");
    if (items.size() == 0) Runtime.trap("Cart is empty");
    if (total < 0.0) Runtime.trap("Invalid order total");

    let now = Time.now();
    let id = "BHM-" # Nat.toText(nextOrderId.value);
    nextOrderId.value += 1;

    let order : Types.Order = {
      id;
      supplier = "DeoDap";
      customerName;
      phone;
      address;
      pincode;
      paymentMethod;
      paymentStatus = if (paymentMethod == "COD") "Pending collection" else "Paid";
      orderStatus = "Order received";
      supplierStatus = "Awaiting DeoDap submission";
      supplierOrderId = "";
      trackingNumber = "";
      items;
      subtotal;
      shipping;
      total;
      createdAt = now;
      updatedAt = now;
    };
    orders.add(id, order);
    order
  };

  public query ({ caller }) func getOrders() : async [Types.Order] {
    if (not isAdmin(caller)) Runtime.trap("Unauthorized: admin only");
    orders.values().toArray()
  };

  public query ({ caller }) func getOrder(orderId : Text) : async ?Types.Order {
    if (not isAdmin(caller)) Runtime.trap("Unauthorized: admin only");
    orders.get(orderId)
  };

  public query func getCustomerOrder(orderId : Text, phone : Text) : async ?Types.Order {
    switch (orders.get(orderId)) {
      case null null;
      case (?order) if (order.phone == phone) ?order else null;
    }
  };

  public shared ({ caller }) func updateOrder(
    orderId : Text,
    orderStatus : Text,
    supplierStatus : Text,
    supplierOrderId : Text,
    trackingNumber : Text,
    paymentStatus : Text,
  ) : async ?Types.Order {
    if (not isAdmin(caller)) Runtime.trap("Unauthorized: admin only");
    switch (orders.get(orderId)) {
      case null null;
      case (?existing) {
        let updated : Types.Order = {
          existing with
          orderStatus;
          supplierStatus;
          supplierOrderId;
          trackingNumber;
          paymentStatus;
          updatedAt = Time.now();
        };
        orders.add(orderId, updated);
        ?updated
      };
    }
  };
};
