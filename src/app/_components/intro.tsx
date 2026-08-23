import { MDXRenderer } from "@/components/mdx-renderer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LANGUAGES } from "@/lib/config";

export default function Intro() {
  return (
    <div className="flex flex-col">
      <Tabs defaultValue="account">
        <TabsList
          variant={"line"}
          className={"px-4 border-b w-full flex justify-start"}
        >
          {LANGUAGES.map((lang) => (
            <TabsTrigger
              value={lang}
              key={lang}
              className={"font-mono text-xs flex-none"}
            >
              {lang}
            </TabsTrigger>
          ))}
        </TabsList>
        {LANGUAGES.map((lang) => (
          <TabsContent value={lang} key={lang} className={"px-4 pb-2 pt-0"}>
            <MDXRenderer folder={"shared"} slug={`intro-${lang}`} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
