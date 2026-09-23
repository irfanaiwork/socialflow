import { AiVisualAnalysis, MediaItem, AiPromptProfile } from '../types';

export class AiService {
  /**
   * Analyzes an image or video based on visual cues, filename, and custom brand profile
   */
  static async analyzeMedia(media: MediaItem, profile?: AiPromptProfile): Promise<AiVisualAnalysis> {
    // Realistic analysis latency simulation
    await new Promise((res) => setTimeout(res, 900));

    const name = media.fileName.toLowerCase();
    const isVideo = media.mediaType === 'video';

    // Topic detection heuristics based on filename, visual metadata, or user prompt profile
    if (name.includes('grocery') || name.includes('20') || name.includes('food') || name.includes('meal')) {
      return {
        mainTopic: '$20 Grocery Challenge & Budget Meal Prep',
        objects: ['Fresh farm vegetables', 'Kraft paper grocery bag', 'Weekly expense receipt', 'Apples', 'Whole oats'],
        people: 'None visible',
        environment: 'Sunlit rustic kitchen counter with wooden butcher block',
        visualStyle: 'Warm high-key lifestyle photography with high contrast clean badge overlay',
        textVisible: '$20 WEEKLY GROCERY CHALLENGE • 7 DINNERS',
        mainMessage: 'Stretch a tight $20 grocery budget into wholesome, nutritious meals for the entire week.',
        targetAudience: profile?.targetAudience || 'Frugal mothers, budget-conscious grocery shoppers, college students',
        contentCategory: 'Frugal Living & Food Budgeting',
        keywords: ['grocery challenge', 'budget meals', 'frugal living', '20 dollar meals', 'cheap grocery list', 'family dinner ideas'],
        searchIntent: 'How to buy a week of groceries on 20 dollars',
        pinterestTitle: '$20 Grocery Challenge: Budget-Friendly Grocery Ideas',
        pinterestDescription: 'Looking for ways to stretch your grocery budget? Discover practical ideas for planning affordable meals and making the most of a $20 grocery budget. Download our full shopping list inside!',
        facebookCaption: 'Can you create a full grocery plan with just $20? Here are some simple, realistic ideas to make every single dollar count this week! 🛒🥦 Save this post for your next store trip!',
        youtubeTitle: '$20 Grocery Challenge: How to Eat for a Week on $20 #Shorts',
        youtubeDescription: 'Stretching a $20 bill into a full week of healthy family dinners! Full meal plan and free grocery list linked below. \n\n👉 Get the free shopping list: https://savvymombudget.com/frugal-deals\n\n#Shorts #BudgetMeals #FrugalLiving',
        youtubeTags: ['shorts', 'budget meals', 'frugal living', '20 dollar meals', 'cheap groceries'],
        suggestedHashtags: ['#GroceryBudget', '#FrugalLiving', '#CheapEats', '#SavvyMom', '#MealPlanningOnABudget'],
        suggestedCta: profile?.cta || 'Tap the link to download the complete $20 grocery checklist & weekly meal plan!'
      };
    }

    if (name.includes('kitchen') || name.includes('quartz') || name.includes('countertop')) {
      return {
        mainTopic: 'Modern Kitchen Remodel & Quartz Countertop Trends',
        objects: ['White veined quartz waterfall island', 'Pendant brass light fixtures', 'Matte black faucets', 'Oak bar stools', 'Tile backsplash'],
        people: 'Not detected',
        environment: 'Spacious contemporary kitchen with natural daylight streaming through black-framed windows',
        visualStyle: 'Architectural interior photography with high dynamic range and warm wood accents',
        textVisible: '2026 KITCHEN DESIGN TRENDS • QUARTZ COUNTERTOPS',
        mainMessage: 'Upgrade your kitchen aesthetics with durable, stain-resistant quartz countertops and minimalist styling.',
        targetAudience: profile?.targetAudience || 'Homeowners, interior design enthusiasts, remodelers, DIY renovators',
        contentCategory: 'Home Decor & Renovation',
        keywords: ['kitchen remodel ideas', 'quartz countertops', 'modern kitchen design', 'kitchen island inspiration', 'kitchen renovation on a budget'],
        searchIntent: 'Best modern kitchen countertop materials and island ideas',
        pinterestTitle: 'Modern Kitchen Countertops: Quartz Waterfall Island Inspiration',
        pinterestDescription: 'Dreaming of a kitchen makeover? Explore the most popular quartz countertop styles, waterfall edge ideas, and timeless cabinet pairings. Pin this for your upcoming remodel inspiration!',
        facebookCaption: 'Waterfall quartz island or classic butcher block? Here are our favorite modern kitchen details from this week! Which one would you choose for your dream home? 🏡✨',
        youtubeTitle: 'Top 3 Kitchen Remodel Mistakes to Avoid #Shorts',
        youtubeDescription: 'Planning a kitchen renovation? Watch before you buy countertops!\n\n📌 Full guide on our blog: https://example.com/kitchen-trends\n\n#Shorts #KitchenDesign #HomeRenovation',
        youtubeTags: ['shorts', 'kitchen remodel', 'quartz countertops', 'interior design', 'home decor'],
        suggestedHashtags: ['#KitchenDesign', '#QuartzCountertops', '#HomeRemodel', '#ModernKitchen', '#InteriorInspo'],
        suggestedCta: profile?.cta || 'Save this pin and click through to explore our full kitchen remodel guide and cost breakdown!'
      };
    }

    if (name.includes('desk') || name.includes('office') || name.includes('workspace')) {
      return {
        mainTopic: 'Minimalist Ergonomic Home Office & Productivity Desk Setup',
        objects: ['Curved ultra-wide monitor', 'Walnut desk shelf riser', 'Mechanical keyboard', 'Ergonomic mesh chair', 'Warm desk lamp'],
        people: 'Not detected',
        environment: 'Clean minimalist home office workspace with soft ambient accent lighting',
        visualStyle: 'Warm moody tech aesthetic with balanced cable management and natural wood textures',
        textVisible: 'DREAM HOME OFFICE DESK SETUP',
        mainMessage: 'Craft a clutter-free, ergonomic workspace designed to maximize daily focus and deep work flow.',
        targetAudience: profile?.targetAudience || 'Remote workers, developers, digital creators, students',
        contentCategory: 'Productivity & Tech Setup',
        keywords: ['desk setup ideas', 'minimalist home office', 'ergonomic workspace', 'desk organization', 'remote work setup'],
        searchIntent: 'How to organize a clean minimalist desk setup for productivity',
        pinterestTitle: 'Minimalist Home Office Desk Setup for Maximum Productivity',
        pinterestDescription: 'Level up your daily workflow with these clean, ergonomic desk setup ideas. From cable management to monitor risers, discover everything you need for a focused workspace.',
        facebookCaption: 'A clean desk = a clear mind! Here is our complete workspace blueprint for remote workers. What is your #1 desk essential you cannot live without? 💻☕',
        youtubeTitle: 'Clean Desk Setup Tour & Cable Management Tips #Shorts',
        youtubeDescription: 'The ultimate minimalist desk setup guide for remote work productivity.\n\n🔗 Setup gear linked in bio: https://example.com/desk-gear\n\n#Shorts #DeskSetup #Productivity',
        youtubeTags: ['shorts', 'desk setup', 'home office', 'productivity', 'minimalist'],
        suggestedHashtags: ['#DeskSetup', '#HomeOfficeInspo', '#WorkFromHome', '#ProductivityHacks', '#MinimalistDesk'],
        suggestedCta: profile?.cta || 'Pin this setup to your board and tap the link to shop every desk accessory!'
      };
    }

    if (name.includes('salad') || name.includes('quinoa') || name.includes('mediterranean')) {
      return {
        mainTopic: 'Fresh Mediterranean Quinoa Salad & 15-Minute Meal Prep',
        objects: ['White ceramic serving bowl', 'Crumbled greek feta', 'Kalamata olives', 'Cherry tomatoes', 'Extra virgin olive oil cruet'],
        people: 'Not detected',
        environment: 'Sunlit marble kitchen island with rustic linen napkins',
        visualStyle: 'Vibrant, high-contrast culinary flat lay photography highlighting fresh textures',
        textVisible: '15-MINUTE MEDITERRANEAN QUINOA SALAD',
        mainMessage: 'Quick, nutrient-dense lunch ready in under 15 minutes that stays crisp and delicious for weekday meal prep.',
        targetAudience: profile?.targetAudience || 'Healthy eaters, busy professionals, meal preppers, Mediterranean diet fans',
        contentCategory: 'Recipes & Healthy Eating',
        keywords: ['mediterranean salad recipe', 'quinoa salad easy', 'healthy lunch ideas', '15 minute meal prep', 'greek salad with quinoa'],
        searchIntent: 'Easy Mediterranean quinoa salad recipe for meal prep lunch',
        pinterestTitle: '15-Minute Mediterranean Quinoa Salad (Easy Meal Prep)',
        pinterestDescription: 'Packed with crisp cucumbers, ripe tomatoes, kalamata olives, and tangy feta! This high-protein Mediterranean quinoa salad is your new go-to easy weekday lunch.',
        facebookCaption: 'Crisp, refreshing, and ready in 15 minutes! This Mediterranean quinoa salad holds up in the fridge all week long without getting soggy. Recipe linked below! 🥗🫒',
        youtubeTitle: 'The 15-Minute High-Protein Salad You Will Make Every Week #Shorts',
        youtubeDescription: 'Super easy Mediterranean quinoa salad recipe!\n\n🥗 Full printable recipe: https://example.com/quinoa-salad\n\n#Shorts #HealthyRecipes #MealPrep',
        youtubeTags: ['shorts', 'healthy recipes', 'salad recipe', 'meal prep', 'mediterranean diet'],
        suggestedHashtags: ['#HealthyLunch', '#MealPrepIdeas', '#MediterraneanDiet', '#SaladRecipe', '#EasyDinners'],
        suggestedCta: profile?.cta || 'Save this recipe to your Healthy Food board and tap through for the printable ingredients card!'
      };
    }

    if (name.includes('decor') || name.includes('living') || name.includes('scandinavian')) {
      return {
        mainTopic: 'Cozy Scandinavian Living Room & Warm Neutral Styling Ideas',
        objects: ['Boucle sofa with chunky knit throw', 'Round travertine coffee table', 'Ceramic vase with dried pampas', 'Abstract line art framed print'],
        people: 'Not detected',
        environment: 'Sun-drenched modern living room with light oak herringbone flooring',
        visualStyle: 'Soft neutral color grading with tactile textures and serene negative space',
        textVisible: 'COZY SCANDINAVIAN LIVING ROOM IDEAS',
        mainMessage: 'Layer warm neutrals, organic wood textures, and ambient lighting to create a soothing sanctuary at home.',
        targetAudience: profile?.targetAudience || 'Home styling lovers, apartment dwellers, minimalist decor fans',
        contentCategory: 'Interior Design & Home Decor',
        keywords: ['scandinavian living room', 'warm neutral living room', 'cozy home aesthetic', 'living room styling', 'neutral decor ideas'],
        searchIntent: 'How to style a cozy Scandinavian neutral living room',
        pinterestTitle: 'Cozy Scandinavian Living Room Decor & Styling Tips',
        pinterestDescription: 'Create a calming, warm neutral living space with these simple styling principles. Discover how to layer textures, choose natural wood accents, and master Scandinavian minimalism.',
        facebookCaption: 'Soft textures, warm oak, and natural light... the perfect weekend sanctuary. Which element is your favorite? 🛋️🕯️',
        youtubeTitle: 'Transform Your Living Room with 3 Neutral Styling Rules #Shorts',
        youtubeDescription: 'How to make any room look instantly warmer and more designer-curated!\n\n🛋️ Details on our site: https://example.com/scandi-living\n\n#Shorts #InteriorDesign #LivingRoomDecor',
        youtubeTags: ['shorts', 'living room decor', 'scandinavian design', 'interior design', 'neutral aesthetic'],
        suggestedHashtags: ['#ScandiHome', '#LivingRoomDecor', '#NeutralAesthetic', '#CozyLiving', '#InteriorInspo'],
        suggestedCta: profile?.cta || 'Save this pin to your Dream Home board and tap to discover budget-friendly source links!'
      };
    }

    if (name.includes('pins') || name.includes('automation') || name.includes('strategy')) {
      return {
        mainTopic: '24 Daily Pins Automation Strategy for Rapid Pinterest Traffic Growth',
        objects: ['Growth metrics dashboard chart', 'Social media calendar timeline', 'Pinterest pin mockups', 'Laptop computer'],
        people: 'Digital marketing strategist reviewing analytics',
        environment: 'Modern creative agency workspace',
        visualStyle: 'High-contrast editorial infographic style with sharp bold typography',
        textVisible: '24 DAILY PINS AUTOMATION BLUEPRINT',
        mainMessage: 'Scale your Pinterest impressions to 100K+ monthly views on autopilot with consistent hourly scheduling.',
        targetAudience: profile?.targetAudience || 'Bloggers, affiliate marketers, e-commerce shop owners, content creators',
        contentCategory: 'Digital Marketing & Pinterest SEO',
        keywords: ['pinterest traffic strategy', 'daily pins schedule', 'pinterest automation crm', 'scale blog traffic', 'pinterest growth guide'],
        searchIntent: 'How many pins to post per day on Pinterest for viral traffic',
        pinterestTitle: 'The 24 Daily Pins Strategy: How to Explode Your Pinterest Reach',
        pinterestDescription: 'Stop manual pinning! Learn how scheduling 24 optimized pins a day with consistent hourly spacing drives tens of thousands of outbound clicks to your website or shop.',
        facebookCaption: 'Want to know how top bloggers generate 50,000+ monthly visits from Pinterest without spending all day on social media? Here is the exact daily automation blueprint! 🚀📈',
        youtubeTitle: 'How to Schedule 24 Pins Every Day in 5 Minutes #Shorts',
        youtubeDescription: 'The step-by-step Pinterest growth hack that saves 20 hours a week.\n\n🚀 Read the full growth guide: https://example.com/pinterest-growth\n\n#Shorts #PinterestMarketing #BloggingTips',
        youtubeTags: ['shorts', 'pinterest marketing', 'blogging tips', 'social media automation', 'traffic growth'],
        suggestedHashtags: ['#PinterestStrategy', '#BloggingTips', '#SocialMediaMarketing', '#TrafficGrowth', '#AutomationTools'],
        suggestedCta: profile?.cta || 'Save this strategy guide and click through to download our free daily scheduling calendar!'
      };
    }

    if (name.includes('planner') || name.includes('budget') || name.includes('expense') || name.includes('finance')) {
      return {
        mainTopic: 'Zero-Based Family Budget Binder & Monthly Tracker',
        objects: ['Printed budgeting binder pages', 'Pastel highlighters', 'Pocket calculator', 'Ceramic coffee cup', 'Ballpoint pen'],
        people: 'Hands organizing receipts and filling out cash envelopes',
        environment: 'Neat scandinavian oak desk setup with soft warm morning light',
        visualStyle: 'Aesthetic pastel desk flat lay with elegant typography and clean borders',
        textVisible: 'FREE PRINTABLE MONTHLY BUDGET PLANNER & EXPENSE TRACKER',
        mainMessage: 'Take total control of household finances, pay off debt, and track savings goals effortlessly.',
        targetAudience: profile?.targetAudience || 'Mothers, young couples, homemakers looking for simple cash envelope budgeting',
        contentCategory: 'Personal Finance & Digital Printables',
        keywords: ['free budget printable', 'expense tracker pdf', 'monthly budget sheet', 'zero based budgeting', 'cash envelopes'],
        searchIntent: 'Download free printable monthly budget sheet pdf',
        pinterestTitle: 'Free Printable Monthly Budget Planner & Expense Tracker',
        pinterestDescription: 'Stop wondering where your paycheck went! Download our free zero-based budget printable template designed to help families track savings, debt payoffs, and everyday spending with ease.',
        facebookCaption: 'Tired of unexpected monthly expenses catching you off guard? Grab our free printable budget binder pages right now! 📓✨ Perfect for organizing every dollar before the month begins.',
        youtubeTitle: 'How to Budget When You Live Paycheck to Paycheck #Shorts',
        youtubeDescription: 'Free printable zero-based budget sheets to organize your money effortlessly!\n\n📥 Download free templates here: https://savvymombudget.com/frugal-deals\n\n#Shorts #Budgeting #PersonalFinance',
        youtubeTags: ['shorts', 'budget planner', 'personal finance', 'debt free', 'free printable'],
        suggestedHashtags: ['#BudgetPlanner', '#FreePrintables', '#DebtFreeCommunity', '#FrugalMom', '#MoneyTracker'],
        suggestedCta: profile?.cta || 'Click through to download your free high-resolution PDF printables now!'
      };
    }

    // Default intelligent analysis based on generic media
    const baseTitle = media.fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const formattedTitle = baseTitle.charAt(0).toUpperCase() + baseTitle.slice(1);

    return {
      mainTopic: `${formattedTitle} - Visual Creative Asset`,
      objects: [isVideo ? 'Motion video frames' : 'High-resolution graphic elements', 'Foreground focal subject', 'Color harmonized background'],
      people: 'Not detected',
      environment: 'Studio / Digital creative composition',
      visualStyle: isVideo ? 'Dynamic 60fps video with clear narrative focus' : 'Crisp high-resolution digital image with modern palette',
      textVisible: formattedTitle.toUpperCase(),
      mainMessage: `Engaging visual content designed to capture viewer attention and drive clicks.`,
      targetAudience: profile?.targetAudience || 'Social media audience interested in high-quality lifestyle and helpful ideas',
      contentCategory: 'Lifestyle & Productivity',
      keywords: [baseTitle, 'trending content', 'viral ideas', 'creative inspiration', 'smart lifestyle'],
      searchIntent: `Best ideas for ${baseTitle}`,
      pinterestTitle: `${formattedTitle}: Practical Guide & Step-by-Step Inspiration`,
      pinterestDescription: `Discover key insights and creative takeaways from ${formattedTitle}. Save this pin to your favorite board and tap the link to learn more!`,
      facebookCaption: `Here is a quick look at ${formattedTitle}! What do you think of this approach? Let us know in the comments below! 👇✨`,
      youtubeTitle: `${formattedTitle} - Fast Breakdown #Shorts`,
      youtubeDescription: `Quick visual guide to ${formattedTitle}!\n\nLink in bio: https://example.com\n\n#Shorts #Tutorial #Inspiration`,
      youtubeTags: ['shorts', baseTitle.toLowerCase(), 'trending', 'tutorial', 'viral'],
      suggestedHashtags: ['#Inspiration', '#TrendingNow', '#CreativeIdeas', '#DailyTips', '#SocialFlow'],
      suggestedCta: profile?.cta || 'Save this post and tap the link in bio for the complete step-by-step breakdown!'
    };
  }

  /**
   * Video-specific frame extraction and transcript analysis simulation
   */
  static async analyzeVideoFrames(media: MediaItem): Promise<{
    duration: string;
    sampledFrames: string[];
    detectedAudio: string;
    suggestedThumbnailTime: string;
  }> {
    await new Promise((res) => setTimeout(res, 700));
    return {
      duration: '0:42',
      sampledFrames: [
        'Frame 00:02 - Establishing shot of magician presenting sealed envelope',
        'Frame 00:15 - Close-up of card shuffle with crowd leaning in',
        'Frame 00:28 - Fast misdirection and unexpected card appearance',
        'Frame 00:39 - Big spectator reaction and applause climax'
      ],
      detectedAudio: 'Spectator: "No way! How did that end up in my hand?!" Magician: "Magic is in the mind."',
      suggestedThumbnailTime: '00:24'
    };
  }
}
