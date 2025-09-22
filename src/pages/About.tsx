import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Leaf, DollarSign, ShoppingBag, Heart, Globe, Wrench } from "lucide-react";
import philippeImage from "@/assets/philippine-karnaval.png";

const About = () => {

  const stats = [
    { number: "12 000", label: "paires revendues", icon: CheckCircle },
    { number: "140", label: "tonnes de CO₂ évitées", icon: Leaf },
    { number: "18€", label: "d'économie moyenne par paire", icon: DollarSign }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-8">
              <span className="text-3xl">👟</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
              Qui sommes-nous ?
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              <strong className="text-primary text-xl md:text-2xl">Karnaval</strong>, c'est l'histoire de <strong className="text-foreground">Philippine Pujol</strong>, une jeune passionnée de sneakers qui a décidé de révolutionner l'industrie de la mode.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium mb-6">
                <span className="mr-2">📖</span>
                Notre histoire
              </div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-8 leading-tight">
                De l'Asie à la France : <br />
                <span className="text-primary">une révolution</span>
              </h2>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p className="text-xl">
                  De retour d'un voyage en Asie, Philippine découvre des <strong className="text-foreground">montagnes de paires jetées</strong> alors qu'elles pourraient encore avoir une vie. Plutôt que de les voir finir à la poubelle, elle a décidé de leur offrir une seconde chance.
                </p>
                <div className="bg-primary/5 p-6 rounded-xl border-l-4 border-primary">
                  <p className="text-foreground font-medium">
                    Notre mission est simple : <strong className="text-primary">reconditionner, upcycler et remettre sur le marché des sneakers authentiques</strong> — pour que tu puisses kiffer ton style sans exploser ton budget.
                  </p>
                </div>
                <p className="text-foreground font-medium text-lg">
                  Chez nous, pas de discours moralisateur. Juste un constat : <strong className="text-primary">acheter malin et responsable, ça peut aussi être fun et stylé.</strong>
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="relative group max-w-md mx-auto lg:max-w-lg">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <img 
                  src={philippeImage} 
                  alt="Philippine Pujol, fondatrice de Karnaval avec le drapeau de l'entreprise"
                  className="relative rounded-2xl shadow-2xl w-full transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium mb-6">
              <span className="mr-2">🔄</span>
              Notre processus
            </div>
            <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              De la récupération à la <span className="text-primary">remise en vente</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Un processus rigoureux pour garantir qualité et impact positif
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Sourcing */}
            <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-background/80 backdrop-blur-sm">
              <CardContent className="p-8 lg:p-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                  Sourcing raisonné
                </h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p className="text-lg">
                    Nous importons des lots de baskets depuis les <strong className="text-foreground">grands pôles urbains européens</strong> (Berlin, Amsterdam, Milan), où la filière de seconde main est riche et bien structurée.
                  </p>
                  <p className="text-lg">
                    Nous travaillons aussi en <strong className="text-foreground">partenariat avec des enseignes françaises</strong> pour récupérer leurs retours clients ou invendus, afin d'éviter qu'ils ne finissent en décharge.
                  </p>
                  <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500 mt-6">
                    <p className="text-green-800 font-medium">
                      <strong>Impact positif :</strong> en prolongeant la durée de vie de chaque sneaker, nous réduisons considérablement les émissions de CO₂ et la consommation d'eau par rapport à la production d'une paire neuve.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reconditionnement */}
            <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-background/80 backdrop-blur-sm">
              <CardContent className="p-8 lg:p-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Wrench className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                  Reconditionnement en France
                </h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p className="text-lg">
                    Chaque paire est ensuite confiée à <strong className="text-foreground">notre atelier français</strong>. Nettoyage en profondeur, désinfection, remplacement des semelles ou des lacets : un protocole strict pour garantir une qualité <strong className="text-primary">« comme neuve »</strong>.
                  </p>
                  <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500 mt-6">
                    <p className="text-blue-800 font-medium">
                      <strong>Impact positif :</strong> En prolongeant la durée de vie de chaque sneaker, nous réduisons considérablement les émissions de CO₂ et la consommation d'eau par rapport à la production d'une paire neuve.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary via-primary to-primary/90 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-primary-foreground/10 rounded-full text-primary-foreground font-medium mb-6">
              <span className="mr-2">📊</span>
              Nos résultats
            </div>
            <h2 className="font-display text-3xl lg:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
              Aujourd'hui, Karnaval c'est déjà :
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="group">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-foreground/10 rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-10 w-10 text-primary-foreground" />
                </div>
                <div className="font-display text-4xl lg:text-5xl font-bold mb-3 text-primary-foreground">
                  {stat.number}
                </div>
                <div className="text-primary-foreground/90 text-lg font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-12 lg:p-16 rounded-3xl text-center border border-primary/20 shadow-2xl">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium mb-8">
                <span className="mr-2">🎯</span>
                Notre mission
              </div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-8 leading-tight">
                Avec Karnaval, tu fais du bien à ton <span className="text-primary">look</span>, à ton <span className="text-primary">porte-monnaie</span> et à la <span className="text-primary">planète</span>.
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Plus responsable</h3>
                  <p className="text-muted-foreground">chaque paire sauvée = moins de déchets textiles et moins de CO₂</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                    <span className="text-2xl">💸</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Plus économique</h3>
                  <p className="text-muted-foreground">jusqu'à 18€ d'économie moyenne par paire</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Toujours authentique</h3>
                  <p className="text-muted-foreground">des modèles vérifiés et garantis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-background/80 backdrop-blur-sm p-12 lg:p-16 rounded-3xl border border-primary/20 shadow-2xl">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium mb-8">
                <span className="mr-2">🚀</span>
                Rejoignez l'aventure
              </div>
              <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground mb-8 leading-tight">
                Rejoignez l'aventure <span className="text-primary">Karnaval</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                Découvrez notre sélection de sneakers reconditionnées et donnez une seconde vie à vos propres paires. 
                <strong className="text-foreground"> Ensemble, créons une mode plus responsable.</strong>
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 h-auto group">
                  <ShoppingBag className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                  Explorer le catalogue
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto group border-2">
                  <Heart className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                  Vendre mes sneakers
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;