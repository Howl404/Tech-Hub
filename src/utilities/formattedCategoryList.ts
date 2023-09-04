import { ProductFormattedData } from '@src/interfaces/Product';
import { getCategories } from '@src/services/ProductsService/ProductsService';

async function formattedCategoryList(): Promise<{
  mainCategories: ProductFormattedData[];
  subCategories: ProductFormattedData[];
  subCategories2: ProductFormattedData[];
}> {
  const mainCategories: ProductFormattedData[] = [];
  const subCategories: ProductFormattedData[] = [];
  const subCategories2: ProductFormattedData[] = [];

  const data1 = await getCategories('parent is not defined');
  data1.results.forEach((item) => {
    const category: ProductFormattedData = {
      name: item.name.en,
      id: item.id,
      ancestors: [],
      slug: item.slug.en,
    };
    mainCategories.push(category);
  });

  const data2 = await getCategories('parent is defined');
  data2.results.forEach((item) => {
    const category: ProductFormattedData = {
      name: item.name.en,
      id: item.id,
      ancestors: [],
      slug: item.slug.en,
    };

    if (item.parent?.id) {
      mainCategories
        .filter((c) => c.id === item.parent?.id)
        .forEach((c) => {
          if (!c.ancestors.find((ancestor) => ancestor.id === item.id)) {
            subCategories.push(category);
            c.ancestors.push(category);
            const itemCopy = item;
            itemCopy.used = true;
          }
        });
    }
  });

  data2.results
    .filter((item) => !item.used)
    .forEach((item) => {
      const category: ProductFormattedData = {
        name: item.name.en,
        id: item.id,
        ancestors: [],
        slug: item.slug.en,
      };

      if (item.parent?.id) {
        subCategories
          .filter((c) => c.id === item.parent?.id)
          .forEach((c) => {
            if (!c.ancestors.find((ancestor) => ancestor.id === item.id)) {
              subCategories2.push(category);
              c.ancestors.push(category);
              const itemCopy = item;
              itemCopy.used = true;
            }
          });
      }
    });

  return {
    mainCategories,
    subCategories,
    subCategories2,
  };
}

export default formattedCategoryList;
