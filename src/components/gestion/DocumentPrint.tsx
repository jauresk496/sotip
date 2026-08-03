interface DocData {
  [key: string]: unknown;
}

interface SortieItem {
  designation: string;
  quantite: string;
  destination: string;
  observations: string;
}

function str(v: unknown): string {
  return v === null || v === undefined ? "" : String(v);
}

function fmtDate(d: unknown): string {
  if (!d) return "";
  const date = new Date(str(d));
  if (isNaN(date.getTime())) return str(d);
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function fmtMoney(v: unknown): string {
  if (!v && v !== 0) return "";
  const n = Number(v);
  if (isNaN(n)) return str(v);
  return n.toLocaleString("fr-FR");
}

function Checkbox({ checked }: { checked: boolean }) {
  return <span className="doc-checkbox">{checked ? "✓" : ""}</span>;
}

function DocHeader() {
  return (
    <div className="doc-header">
      <div className="doc-header-left">
        <img src="/images/sotipci-logo.png" alt="SOTIP-CI" className="doc-logo" />
        <div className="doc-logo-sub">S.A.R.L.</div>
        <div className="doc-logo-tag">Société de travaux Industriels et de prestation de Côte d'Ivoire</div>
      </div>
      <div className="doc-header-right">
        <div className="doc-slogan">Votre Domaine,<br />notre Expertise.</div>
        <ul className="doc-activities">
          <li>Structures métalliques et mixtes, Calorifugeage</li>
          <li>Chaudronnerie, Soudure Industrielle, Tuyauterie</li>
          <li>Sablage et peinture, Maintenance Industrielle</li>
          <li>Graissage, Génie Civil et Prestations Diverses</li>
        </ul>
      </div>
    </div>
  );
}

function DocContactLine() {
  return (
    <>
      <div className="doc-contact">
        Marcory Anoumabo au palmier non loin de l'hôpital de sans fil, rue Bamba Kassoum - Cel: (+225) 07 48 26 95 74 / 07 48 09 80 09<br />
        E-mail: contact.sotipci@gmail.com - sotipcicontact@gmail.com / www.sotipci.com
      </div>
      <div className="doc-green-line"></div>
    </>
  );
}

export function BonCaissePrint({ data, docNumber }: { data: DocData; docNumber: string }) {
  return (
    <div className="doc-sheet">
      <DocHeader />
      <DocContactLine />
      <div className="doc-title-row">
        <h1 className="doc-title">BON DE CAISSE</h1>
        <div className="doc-date-box">
          <div><strong>Date :</strong> {fmtDate(data.date)}</div>
          <div style={{ fontSize: ".85rem", marginTop: ".3rem" }}><strong>N° :</strong> {docNumber}</div>
        </div>
      </div>
      <div className="doc-amount-box">
        <span className="doc-amount-currency">F. cfa</span>
        <span className="doc-amount-value">{fmtMoney(data.montant)}</span>
      </div>
      <div className="doc-sens-row">
        <span className="doc-sens-item"><strong>Entrée</strong> <Checkbox checked={data.sens === "entree"} /></span>
        <span className="doc-sens-item"><strong>Sortie</strong> <Checkbox checked={data.sens === "sortie"} /></span>
      </div>
      <div className="doc-line-field">
        <strong>REÇU de Mr ou Mme :</strong>
        <span className="doc-line-value">{str(data.recu_de)}</span>
      </div>
      <div className="doc-line-field">
        <strong>Montant <em>( en lettre )</em> :</strong>
        <span className="doc-line-value">{str(data.montant_lettre)}</span>
      </div>
      <div className="doc-line-field">
        <strong>Motif :</strong>
        <span className="doc-line-value">{str(data.motif)}</span>
      </div>
      <div className="doc-line-field">
        <strong>AVANCE :</strong>
        <span className="doc-line-value doc-line-short">{fmtMoney(data.avance)}</span>
        <strong>f cfa</strong>
        <span style={{ margin: "0 1rem" }}>/</span>
        <strong>RESTE :</strong>
        <span className="doc-line-value doc-line-short">{fmtMoney(data.reste)}</span>
        <strong>f cfa</strong>
      </div>
      <div className="doc-line-field">
        <strong><em>ORDRE DONNEE PAR</em> :</strong>
        <span className="doc-line-value">{str(data.ordre_donne_par)}</span>
      </div>
      <div className="doc-mode-row">
        <span className="doc-mode-item"><Checkbox checked={data.mode === "cash"} /> <strong>CASH</strong></span>
        <span className="doc-mode-item"><Checkbox checked={data.mode === "depot"} /> <strong>DEPOT :</strong> <span className="doc-line-value doc-line-short">{str(data.depot_detail)}</span></span>
      </div>
      <div className="doc-mode-row">
        <span className="doc-mode-item"><Checkbox checked={data.compte === "personnel"} /> <strong>POUR COMPTE PERSONNEL</strong></span>
        <span className="doc-mode-item"><Checkbox checked={data.compte === "entreprise"} /> <strong>POUR LE COMPTE ENTREPRISE</strong></span>
      </div>
      <div className="doc-signatures">
        <div className="doc-sig"><em>BÉNÉFICIAIRE</em></div>
        <div className="doc-sig"><em>COMPTABILITÉ</em></div>
        <div className="doc-sig"><em>DIRECTION</em></div>
      </div>
    </div>
  );
}

export function RecuPrint({ data, docNumber }: { data: DocData; docNumber: string }) {
  return (
    <div className="doc-sheet doc-sheet-small doc-times">
      <div className="doc-header">
        <div className="doc-header-left">
          <img src="/images/sotipci-logo.png" alt="SOTIP-CI" className="doc-logo" />
          <div className="doc-logo-tag">Société de travaux Industriels et de prestation de Côte d'Ivoire</div>
          <div className="doc-contact-small">
            Cel: (+225) 07 48 26 95 74 / 07 48 09 80 09<br />
            E-mail: contact.sotipci@gmail.com
          </div>
        </div>
        <div className="doc-date-box">
          <strong>Date :</strong> {fmtDate(data.date)}
        </div>
      </div>
      <div className="doc-recu-title-row">
        <h1 className="doc-title">REÇU</h1>
        <div className="doc-bpf">
          <strong>BPF</strong>
          <span className="doc-bpf-box">{str(data.bpf)}</span>
        </div>
      </div>
      <div style={{ fontSize: ".8rem", color: "#555", marginBottom: ".8rem" }}>N° {docNumber}</div>
      <div className="doc-line-field">
        <strong>Reçu de M./Mme</strong>
        <span className="doc-line-value">{str(data.recu_de)}</span>
      </div>
      <div className="doc-line-field">
        <strong>la somme de</strong>
        <span className="doc-line-value">{str(data.somme)}</span>
      </div>
      <div className="doc-line-field" style={{ marginTop: "1.2rem" }}>
        <strong>Article(s) :</strong>
        <span className="doc-line-value">{str(data.articles)}</span>
      </div>
      <div className="doc-line-field" style={{ marginTop: "1.2rem" }}>
        <strong>Avance :</strong>
        <span className="doc-line-value doc-line-short">{str(data.avance)}</span>
        <strong style={{ marginLeft: "2rem" }}>Reste :</strong>
        <span className="doc-line-value doc-line-short">{str(data.reste)}</span>
      </div>
      <div className="doc-signature-right">
        <em>Signature et Cachet</em>
      </div>
      <div className="doc-line-field" style={{ marginTop: "2rem" }}>
        <em>Reçu établi par</em>
        <span className="doc-line-value">{str(data.etabli_par)}</span>
      </div>
    </div>
  );
}

export function BonSortiePrint({ data, docNumber }: { data: DocData; docNumber: string }) {
  const items = (data.items as SortieItem[]) || [];
  const rows = Math.max(items.length, 8);
  const filled = [...items];
  while (filled.length < rows) {
    filled.push({ designation: "", quantite: "", destination: "", observations: "" });
  }

  return (
    <div className="doc-sheet">
      <div className="doc-header doc-header-bordered">
        <div className="doc-header-left">
          <img src="/images/sotipci-logo.png" alt="SOTIP-CI" className="doc-logo" />
          <div className="doc-logo-sub">S.A.R.L.</div>
          <div className="doc-logo-tag">Société de travaux Industriels et de prestation de Côte d'Ivoire</div>
        </div>
        <h1 className="doc-title" style={{ margin: 0 }}>BON DE SORTIE</h1>
      </div>
      <div style={{ fontSize: ".8rem", color: "#555", margin: ".5rem 0" }}>N° {docNumber}</div>
      <div className="doc-line-field">
        <strong>DATE :</strong>
        <span className="doc-line-value">{fmtDate(data.date)}</span>
      </div>
      <div className="doc-line-field">
        <strong>NOM EMETEUR :</strong>
        <span className="doc-line-value">{str(data.nom_emetteur)}</span>
      </div>
      <div className="doc-line-field">
        <strong>SERVICE :</strong>
        <span className="doc-line-value">{str(data.service)}</span>
      </div>
      <table className="doc-table">
        <thead>
          <tr>
            <th>DESIGNATION</th>
            <th style={{ width: "15%" }}>QUANTITE</th>
            <th style={{ width: "25%" }}>DESTINATION</th>
            <th style={{ width: "25%" }}>OBSERVATIONS</th>
          </tr>
        </thead>
        <tbody>
          {filled.map((item, i) => (
            <tr key={i}>
              <td>{item.designation || "\u00A0"}</td>
              <td>{item.quantite || "\u00A0"}</td>
              <td>{item.destination || "\u00A0"}</td>
              <td>{item.observations || "\u00A0"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="doc-signatures doc-signatures-2">
        <div className="doc-sig">VISA DU CHEF DE SERVICE</div>
        <div className="doc-sig">VISA</div>
      </div>
      <div className="doc-nota">
        <strong>NOTA</strong>&nbsp;&nbsp;Exemplaire Chauffeur
      </div>
    </div>
  );
}

export default function DocumentPrint({ doc }: { doc: { doc_type: string; doc_number: string; data: DocData } }) {
  switch (doc.doc_type) {
    case "bon_caisse":
      return <BonCaissePrint data={doc.data} docNumber={doc.doc_number} />;
    case "recu":
      return <RecuPrint data={doc.data} docNumber={doc.doc_number} />;
    case "bon_sortie":
      return <BonSortiePrint data={doc.data} docNumber={doc.doc_number} />;
    default:
      return <div>Type de document inconnu</div>;
  }
}
