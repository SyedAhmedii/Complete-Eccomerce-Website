import { SearchParams } from "nuqs/server";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { loadProductsFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { DEFAULT_LIMIT } from "@/constants";

interface Props {
          params: Promise<{
                    subcategory: string;
          }>,
          searchParams: Promise<SearchParams>;
};


const Page = async ({ params, searchParams }: Props) => {
          const { subcategory } = await params;
          const filters = await loadProductsFilters(searchParams);

          console.log(JSON.stringify(filters), "This is form RSC")
          const queryClient = getQueryClient();
          void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
                    ...filters,
                    category: subcategory,
                    limit: DEFAULT_LIMIT,
          }))
          return (
                    <HydrationBoundary state={dehydrate(queryClient)}>
                              <ProductListView category={subcategory}/>
                    </HydrationBoundary>
          )
}

export default Page;