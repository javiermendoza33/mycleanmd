import Link from "next/link";
import { METHOD } from "@/labo/content";
import { mc, lh, type Lang } from "@/labo/method/i18n";
import WaitlistForm from "@/components/labo/method/WaitlistForm";

/** What /start shows while METHOD_OPEN is false (content.ts): "opening soon" and the opening list, in place of the sign-up. */
export default function StartSoonView({ lang, program }: { lang: Lang; program?: string }) {
  const c = mc(lang), s = c.t.soon;
  const p = program ? c.getProgram(program) : undefined;
  return (
    <section className="soon">
      <div className="wrap tight">
        <span className="tag">{s.k}</span>
        <h1>{s.h1[0]}<em>{s.h1[1]}</em></h1>
        <p className="sub">{s.sub}{p ? ` ${s.programLine(p.name)}` : ""}</p>
        <WaitlistForm lang={lang} />
        <p className="note">{s.ask1}<a href={`mailto:${METHOD.email}?subject=${encodeURIComponent(METHOD.name)}`}>{METHOD.email}</a>{s.ask2}</p>
        <div className="acts">
          <Link className="btn btn-ghost" href={lh(lang, "/programs")}>{s.seePrograms}</Link>
          <Link className="btn btn-ghost" href={lh(lang, "/pricing")}>{s.seePricing}</Link>
        </div>
      </div>
    </section>
  );
}
