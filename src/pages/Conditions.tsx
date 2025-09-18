import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const Conditions = () => {
  return (
    <>
      <Helmet>
        <title>Conditions Générales d'Utilisation et de Vente | Karnaval</title>
        <meta 
          name="description" 
          content="Consultez les conditions générales d'utilisation et de vente de Karnaval. Informations sur vos droits, garanties et modalités d'achat de sneakers reconditionnées." 
        />
        <meta name="keywords" content="CGU, CGV, conditions générales, sneakers reconditionnées, Karnaval" />
        <link rel="canonical" href="https://karnaval.fr/conditions" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Conditions Générales
            </h1>
            <p className="text-muted-foreground text-lg">
              Conditions d'utilisation et de vente de Karnaval
            </p>
          </header>

          <div className="space-y-8">
            {/* CGU Section */}
            <Card className="shadow-soft">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-2xl">📌</span>
                  <h2 className="text-2xl font-bold text-foreground">
                    Conditions Générales d'Utilisation (CGU)
                  </h2>
                </div>

                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Article 1 – Objet
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Les présentes conditions définissent les règles d'utilisation du site e-commerce karnaval.fr.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Article 2 – Création de compte
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      L'utilisateur peut créer un compte avec email et mot de passe pour suivre ses commandes. Il s'engage à fournir des informations exactes.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Article 3 – Données personnelles
                    </h3>
                    <div className="space-y-3 text-muted-foreground leading-relaxed">
                      <p>
                        <strong>Les données collectées :</strong> nom, prénom, adresse, email, téléphone, historique d'achats, cookies d'authentification.
                      </p>
                      <p>
                        <strong>Utilisation :</strong> gestion des commandes, confirmation par email, réinitialisation de mot de passe.
                      </p>
                      <p>
                        Conformément au RGPD, l'utilisateur peut demander la suppression ou modification de ses données à : 
                        <strong className="text-primary"> valentin.lefevre33000@gmail.com</strong>.
                      </p>
                    </div>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Article 4 – Responsabilité
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Le site ne peut être tenu responsable en cas d'interruption ou de problème technique indépendant de sa volonté.
                    </p>
                  </section>
                </div>
              </CardContent>
            </Card>

            {/* CGV Section */}
            <Card className="shadow-soft">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-2xl">📌</span>
                  <h2 className="text-2xl font-bold text-foreground">
                    Conditions Générales de Vente (CGV)
                  </h2>
                </div>

                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Article 1 – Objet
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Les présentes conditions régissent les ventes de sneakers reconditionnées réalisées sur le site karnaval.fr.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Article 2 – Prix
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Les prix affichés sont en euros TTC. Des frais de livraison s'appliquent pour toute commande inférieure à 50 €.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Article 3 – Commandes
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Le client valide sa commande en ligne via le site. Le paiement est accepté uniquement par carte bancaire.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Article 4 – Livraison
                    </h3>
                    <div className="space-y-2 text-muted-foreground leading-relaxed">
                      <p><strong>• Délais :</strong> 3 à 5 jours ouvrés en France métropolitaine.</p>
                      <p><strong>• Frais :</strong> offerts dès 50 € d'achat, sinon facturés selon le barème affiché au moment de la commande.</p>
                    </div>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Article 5 – Droit de rétractation
                    </h3>
                    <div className="space-y-3 text-muted-foreground leading-relaxed">
                      <p>
                        Conformément à l'article L.221-18 du Code de la consommation, le client dispose d'un délai de 
                        <strong className="text-primary"> 14 jours</strong> pour retourner un produit non porté, dans son emballage d'origine.
                      </p>
                      <p>Les frais de retour sont à la charge du client.</p>
                    </div>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Article 6 – Garanties
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Aucune garantie contractuelle. Les produits étant reconditionnés, seule la conformité et l'authenticité sont assurées.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Article 7 – Litiges
                    </h3>
                    <div className="space-y-3 text-muted-foreground leading-relaxed">
                      <p>
                        En cas de litige, le tribunal compétent est celui de <strong className="text-primary">Bordeaux</strong>.
                      </p>
                      <p>
                        <strong>Médiation :</strong> Conformément à l'article L.612-1 du Code de la consommation, le client peut recourir gratuitement au médiateur de la consommation :
                      </p>
                      <p className="text-primary">
                        [Médiateur e-commerce de la FEVAD – www.mediateurfevad.fr]
                      </p>
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};