import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { medicines } from "@/data/medicines";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { ShoppingCart, Plus, Minus, Trash2, Truck, Pill, Search, X } from "lucide-react";
import { useState } from "react";

export default function PharmacyPage() {
  const { items, addItem, removeItem, updateQuantity, clearCart, total, itemCount } = useCartStore();
  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const filtered = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) || m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <section className="gradient-medical text-primary-foreground py-20">
        <div className="container text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-heading font-bold mb-4">
            <Pill className="inline w-10 h-10 mr-2" /> Online Pharmacy
          </motion.h1>
          <p className="text-lg opacity-80">Order medicines online with same-day delivery across Nairobi</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search medicines..." className="pl-10" />
            </div>
            <Button variant="outline" onClick={() => setShowCart(!showCart)} className="relative">
              <ShoppingCart className="w-4 h-4 mr-2" /> Cart ({itemCount()})
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="grid sm:grid-cols-2 gap-4">
                {filtered.map((med) => (
                  <Card key={med.id} className="hover:shadow-md transition-all">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-heading font-semibold">{med.name}</h3>
                          <p className="text-xs text-muted-foreground">{med.generic}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-accent text-accent-foreground">{med.category}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{med.description}</p>
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-primary">KSh {med.price.toLocaleString()}</p>
                        <div className="flex items-center gap-2">
                          {med.requiresPrescription && <span className="text-xs text-destructive font-semibold">Rx</span>}
                          <Button size="sm" onClick={() => { addItem(med); toast.success(`${med.name} added to cart`); }} className="gradient-medical border-0 text-primary-foreground">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Cart sidebar */}
            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" /> Your Cart
                  </h2>
                  {items.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">Your cart is empty</p>
                  ) : (
                    <>
                      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                        {items.map((item) => (
                          <div key={item.medicine.id} className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{item.medicine.name}</p>
                              <p className="text-xs text-muted-foreground">KSh {item.medicine.price} × {item.quantity}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button size="icon" variant="outline" className="w-7 h-7" onClick={() => updateQuantity(item.medicine.id, item.quantity - 1)}><Minus className="w-3 h-3" /></Button>
                              <span className="text-sm w-6 text-center">{item.quantity}</span>
                              <Button size="icon" variant="outline" className="w-7 h-7" onClick={() => updateQuantity(item.medicine.id, item.quantity + 1)}><Plus className="w-3 h-3" /></Button>
                              <Button size="icon" variant="ghost" className="w-7 h-7 text-destructive" onClick={() => removeItem(item.medicine.id)}><Trash2 className="w-3 h-3" /></Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <hr className="border-border mb-4" />
                      <div className="flex justify-between font-bold mb-4">
                        <span>Total</span>
                        <span className="text-primary">KSh {total().toLocaleString()}</span>
                      </div>
                      {!showCheckout ? (
                        <Button className="w-full gradient-medical border-0 text-primary-foreground" onClick={() => setShowCheckout(true)}>
                          <Truck className="w-4 h-4 mr-2" /> Proceed to Checkout
                        </Button>
                      ) : (
                        <div className="space-y-3">
                          <Input placeholder="Delivery address in Nairobi" />
                          <Input placeholder="Phone number (M-Pesa)" />
                          <Button className="w-full gradient-medical border-0 text-primary-foreground" onClick={() => { clearCart(); setShowCheckout(false); toast.success("Order placed! 🎉 Delivery within 2-4 hours."); }}>
                            Pay KSh {(total() + 200).toLocaleString()} (incl. delivery)
                          </Button>
                          <p className="text-xs text-center text-muted-foreground">Delivery fee: KSh 200 within Nairobi</p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
