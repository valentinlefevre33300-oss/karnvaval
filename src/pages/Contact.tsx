import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, MessageSquare, HelpCircle, Instagram } from "lucide-react";
import ContactMap from "@/components/ContactMap";
const Contact = () => {
  const contactInfo = [{
    icon: MapPin,
    title: "Adresse",
    content: "16 rue Théodort Blanc\nBruges, Belgique"
  }, {
    icon: Mail,
    title: "Email",
    content: "hello@karnaval.com"
  }, {
    icon: Instagram,
    title: "Instagram",
    content: "@karnaval_sneakers"
  }, {
    icon: Clock,
    title: "Temps de réponse",
    content: "Moins de 24h\n(promis, on est réactifs)"
  }];
  const faqItems = [{
    question: "Comment fonctionne la garantie ?",
    answer: "Nous offrons une garantie de 30 jours sur tous nos produits reconditionnés."
  }, {
    question: "Quels sont les délais de livraison ?",
    answer: "Livraison gratuite sous 2-3 jours ouvrés pour toute commande supérieure à 60€."
  }, {
    question: "Comment vendre mes sneakers ?",
    answer: "Contactez-nous avec des photos de vos sneakers, nous vous ferons une estimation."
  }, {
    question: "Les sneakers sont-elles authentiques ?",
    answer: "Oui, chaque paire est authentifiée par nos experts avant mise en vente."
  }];
  return <div className="space-y-16">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-6">
          Contacte-<span className="text-primary">nous</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-6">
          Une question sur ta commande ? Une paire qui te fait hésiter ?
        </p>
        <p className="text-lg text-foreground font-medium">
          Écris-nous, on est là pour toi 👇
        </p>
      </section>

      {/* Contact Info & Form */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information */}
          <div>
            <div className="space-y-6 mb-8">
              {contactInfo.map((info, index) => <Card key={index} className="border-0 shadow-soft p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                      <p className="text-muted-foreground whitespace-pre-line">{info.content}</p>
                    </div>
                  </div>
                </Card>)}
            </div>

            {/* Additional Contact Methods */}
            <Card className="border-0 shadow-soft p-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">💬 Chat en ligne</h3>
                  <p className="text-muted-foreground">Réponse rapide directement sur le site</p>
                </div>
              </div>
            </Card>

            <div className="bg-gradient-primary/5 border border-primary/20 rounded-lg p-4 mb-8">
              <p className="text-sm text-foreground text-center font-medium">
                👉 Parce qu'acheter malin, c'est aussi avoir un service client qui te suit.
              </p>
            </div>

            {/* Interactive Map */}
            <ContactMap />
          </div>

          {/* Contact Form */}
          
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-bold text-foreground mb-6">
            Questions fréquentes
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trouvez rapidement des réponses aux questions les plus courantes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          {faqItems.map((item, index) => <Card key={index} className="border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <HelpCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {item.question}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div>
      </section>

      {/* Support Section */}
      
    </div>;
};
export default Contact;