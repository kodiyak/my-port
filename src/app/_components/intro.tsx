import Image from "next/image";
import { MDXRenderer } from "@/components/mdx-renderer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LANGUAGES } from "@/lib/config";

export default function Intro() {
  return (
    <div className="flex flex-col">
      <Tabs defaultValue="pt-br">
        <TabsList
          variant={"line"}
          className={"px-4 border-b border-dashed w-full flex justify-start"}
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
            <div className="flex items-start gap-4">
              <div className="size-24 rounded-lg">
                <Image
                  src={"/assets/avatar.png"}
                  width={200}
                  height={200}
                  alt={"Mathews W. Oliveira Teodoro"}
                  className="size-24 rounded-lg object-cover"
                />
              </div>
              <div className="flex flex-col flex-1">
                <MDXRenderer folder={"shared"} slug={`intro-${lang}`} />
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
