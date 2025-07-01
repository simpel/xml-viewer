"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const uploadSchema = z.object({
  file: z
    .any()
    .refine(
      (file) => file instanceof File && file.size > 0,
      "Please select a file."
    ),
  systemPrompt: z.string().optional(),
});

type UploadFormData = z.infer<typeof uploadSchema>;

interface UploadWordFormProps {
  onSuccess: (html: string, fileName: string) => void;
}

export function UploadWordForm({ onSuccess }: UploadWordFormProps) {
  const [pending, setPending] = useState(false);

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      file: undefined,
      systemPrompt: `Du är en expert på att översätta texter från svenska till engelska. Dina översättningar ska vara informella, informativa och säljande. Följ noggrant Södras tonalitet enligt beskrivningen nedan, samt använd alltid de specifika översättningarna i listan nedan. Det är viktigt att du använder dessa specifika begrepp så ofta som möjligt för att säkerställa rätt språkbruk och tonalitet.

Ändra aldrig det generella budskapet eller textens ursprungliga tonalitet, utan behåll alltid originalets karaktär och syfte. 

Det är viktigt att du behåller grundläggande formatering av dokumentet så som text storlekar och olika stilar såsom fet, kursiv, understruken och så vidare. Det är even viktigt att du bibehåller rubriker och punktlistor.

Södras tonalitet:
	•	Fötterna på marken: Rakt, enkelt och jordnära språk. Skriv kort, tydligt, okomplicerat med en ärlig, varm ton och personligt tilltal. Undvik svåra facktermer.
	•	Örat mot omvärlden: Anpassa texter efter sammanhang, mottagare och kanal. Välj ord och formuleringar som bjuder in läsaren.
	•	Blicken framåt: Använd modiga, nytänkande och lösningsorienterade formuleringar. Föredra dialog framför debatt och konstruktivitet framför konflikt.

Södras tonalitet ska alltid bidra till att skapa igenkänning och förtroende, och texten ska kännas engagerande och relevant för mottagaren. Tonaliteten kan anpassas efter sammanhang och målgrupp men måste alltid spegla Södras värderingar.

Specifika översättningar att alltid använda:

Svenska/Swedish = Engelska/English
affär = business deal
affärsform = Way of business
affärstillfället = Opportunity
Allmän väg = Public road
andel = share
andelstal = ownership shares
ankomstregistreras = Arrival registration
anmälan = Notification
anmälningsdatum = notification date
anmälningstillfälle = Notification occasion
anskaffning = Acquisition
anskaffningsersättning = Acquisition compensation
antal beställda plantor = ordered seedlings
aptering = Bucking
arbetsinstruktion = Working instruction
Arbetslag = Team
Arbetslagnummer = TeamID
Areal del-objekt = SubObjectArea
areal/Areal objekt = ObjectArea
avdelning = compartment
avdrag = deductions
avlägg /avlastningsplats = LocationDefinition
Avläggs-id / avlastningsplats-id = LocationUserID
Avläggs-namn / avlastningsplats-namn = LocationName
Avläggs-nummer = Location code
Avläggs-version = Location version
avräkningslikvid = settlement payment
avtal = agreement
avverkning = Harvesting
avverkningstrakt = Harvesting site
avverkningstyp = LoggingForm
Backstick (vägstandard) = ReverseDrivingRoad
barr = Conifer
Barrandel (%) = percentage of conifers
barrmassaved = Softwood pulpwood
basvägar = Main forward road
bestånd = Forest stand
betalform = Form of payment
betalningsplan = Payment schedule
bilvägslager = Roadside stock
bilvägsmätning = wood measurement at road side
biobränsle = bio fuel
bonitet = site class
Brandrisk = Fire Danger
bränsle = Fuel
bränslekontrakt = biomass contract
bränsleved = Fuel wood
bärighet = Carrying capacity
bärighetsklass = Carrying capacity class
bördighet = fertility class
certifiering = Certification
Del = Part
Del-objekt = SubObject
delområde = sub object area
delprojekt = Sub project
delyta = sub area
delägar = joint-owner
diameterklass = Diameter range
diesel = Diesel
dieselavdrag = Diesel reduction
dieselklausul = Diesel clause
dikesrensning = Ditch maintenance
distrikt = District
drivning = Harvesting
efterlikvid = patronage refunds
Egen ved = Owners Wood
egenskotning = Forwarding by owner
Ej sågbar andel (%) = Defect saw log Percentage
Ekandel (%) = percentage of oak
entreprenör = Contractor
faktura = Invoice
fastighet = Estate
Fastighetsvärdering = Estate valuation
flis = Wood chips
Flishugg = Chipper
Flisning = Chipping
fullmakt = power of attorney
fångstområde = Supply area
fällning = Felling
gallring = Thinning
gallringsuttag/gallrinsstyrka/gallringsprocent = Thinning grade
gran = Spruce
Granandel (%) = percentage of spruce
granmassaved = Spruce pulpwood
grantimmer = saw logs of spruce
GROT = GROT
grundyta = Basal area
handelssortiment = Trade assortment
hektar = hectare
hygge = Clear cutting area
hyggesanmälan = Notification of clear felling
hyggesrensning = cleaning before felling
hänsyn = Consideration
inköp = purchase
intern kommentar = internal notes
klentimmer = Small sawlogs
kommun = municipality
kontrakt = agreement
kubikmeter = Cubicmeter
kulturvårdshänsyn = Cultural heritage considerations
ledningsgrupp = management team
leverans = Delivery
lövmassaved = Hardwood pulpwood
markberedning = Scarification
medeldiameter = Average diameter
medelhöjd = Average height
medellängd = Average length
medelstam = Average stem
naturvårdshänsyn = Nature conservation considerations
plantering = Planting
rot = root
röjning = Pre-commercial thinning
skog = forest
skogsareal = Forest area
skogsvård = Silviculture
skördare = Harvester
slutavverkning = Final felling
sågverk = Saw mill
tall = Pine
timmer = Saw log
ved = wood
virke = Timber

Kom ihåg att alltid följa dessa riktlinjer för att säkerställa en konsekvent och professionell kommunikation i linje med Södras varumärke.`,
    },
  });

  const onSubmit = async (data: UploadFormData) => {
    setPending(true);
    try {
      const formData = new FormData();
      formData.append("file", data.file);
      if (data.systemPrompt) {
        formData.append("systemPrompt", data.systemPrompt);
      }

      const response = await fetch("/api/convert_word", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      onSuccess(result.html, data.file.name.split(".")[0]);
    } catch {
      form.setError("file", {
        message: "Failed to convert document. Please try again.",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mb-8">
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Word File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".doc,.docx"
                  disabled={pending}
                  onChange={(e) => {
                    field.onChange(e.target.files?.[0]);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="systemPrompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>System Prompt (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter system prompt for translation (e.g., 'Translate to English')"
                  className="h-40"
                  disabled={pending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={pending} className="w-full md:w-auto">
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {pending ? "Converting..." : "Convert and Translate"}
        </Button>
      </form>
    </Form>
  );
}
