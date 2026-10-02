/**
 * Composición editorial minimalista: foto en círculo con un anillo rojo
 * delgado, y dos acentos diagonales discretos en las esquinas opuestas
 * para dar dinamismo sin saturar.
 */
export function HeroArtwork() {
  return (
    <div className="hero-artwork" role="img" aria-label="Edificios corporativos de SOLUCIONES PAXO C.A.">
      <div aria-hidden className="hero-artwork__image-frame hero-artwork__image-frame--ghost">
        <img className="hero-artwork__photo" src="/brand/hero-visual.png" alt="" />
      </div>
      <div className="hero-artwork__image-frame">
        <img className="hero-artwork__photo" src="/brand/hero-visual.png" alt="" />
      </div>
    </div>
  );
}
