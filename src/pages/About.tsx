import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Recycle, Euro, Sparkles, CheckCircle, Leaf, DollarSign, ShoppingBag, Heart } from "lucide-react";
import philippeImage from "@/assets/philippine-karnaval.png";

const About = () => {
  const benefits = [
    {
      icon: Euro,
      title: "Moins cher",
      description: "jusqu'à -20% par rapport au neuf"
    },
    {
      icon: Recycle,
      title: "Plus responsable",
      description: "chaque paire sauvée = moins de déchets textiles et moins de CO₂"
    },
    {
      icon: Sparkles,
      title: "Toujours stylé",
      description: "des modèles authentiques, vérifiés et garantis"
    }
  ];

  const stats = [
    { number: "12 000", label: "paires revendues", icon: CheckCircle },
    { number: "140", label: "tonnes de CO₂ évitées", icon: Leaf },
    { number: "18€", label: "d'économie moyenne par paire", icon: DollarSign }
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-6">
          Qui sommes-nous ?
        </h1>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
          <strong className="text-primary">Karnaval</strong>, c'est l'histoire de <strong>Philippine Pujol</strong>, une jeune passionnée de sneakers.
        </p>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Notre histoire
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg">
              <p>
                De retour d'un voyage en Asie, elle découvre des montagnes de paires jetées alors qu'elles pourraient encore avoir une vie. Plutôt que de les voir finir à la poubelle, elle a décidé de leur offrir une seconde chance.
              </p>
              <p>
                Notre mission est simple : <strong className="text-foreground">reconditionner, upcycler et remettre sur le marché des sneakers authentiques</strong> — pour que tu puisses kiffer ton style sans exploser ton budget.
              </p>
              <p className="text-foreground font-medium">
                Chez nous, pas de discours moralisateur. Juste un constat : acheter malin et responsable, ça peut aussi être fun et stylé.
              </p>
            </div>
          </div>
          <div className="relative">
            <img 
              src={philippeImage} 
              alt="Philippine Pujol, fondatrice de Karnaval avec le drapeau de l'entreprise"
              className="rounded-lg shadow-large w-full"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold text-foreground mb-6">
            Pourquoi choisir Karnaval ?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center border-0 shadow-soft">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6">
                  <benefit.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  👟 {benefit.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">
              Aujourd'hui, Karnaval c'est déjà :
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="text-primary-foreground">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-foreground/10 rounded-2xl mb-4">
                  <stat.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="font-display text-4xl font-bold mb-2">✅ {stat.number}</div>
                <div className="text-primary-foreground/80 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-12 rounded-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-6">
            👉 Avec Karnaval, tu fais du bien à ton look, à ton porte-monnaie et à la planète.
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            🌱 Plus responsable : chaque paire sauvée = moins de déchets textiles et moins de CO₂<br />
            💸 Plus économique : jusqu'à 18€ d'économie moyenne par paire<br />
            ✨ Toujours authentique : des modèles vérifiés et garantis
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 text-center">
        <div className="bg-card p-12 rounded-2xl border border-border">
          <h2 className="font-display text-3xl font-bold text-foreground mb-6">
            Rejoignez l'aventure Karnaval
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Découvrez notre sélection de sneakers reconditionnées et donnez une seconde vie à vos propres paires.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Explorer le catalogue
            </Button>
            <Button variant="outline" size="lg">
              <Heart className="mr-2 h-5 w-5" />
              Vendre mes sneakers
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;