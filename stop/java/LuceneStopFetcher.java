import java.util.Iterator;
import java.lang.reflect.Method;
import java.lang.reflect.InvocationTargetException;

public class LuceneStopFetcher {

	private static void usage() {
		System.err.println("Usage: java -cp .:lucene-analyzers-common-4.1.0.jar:lucene-core-4.1.0.jar " + 
					LuceneStopFetcher.class.getName() + " <language> <Analyzer class>");
	}

	public static void main(String args[]) throws 
			ClassNotFoundException, IllegalAccessException, 
			InvocationTargetException, NoSuchMethodException {

		if (args.length < 2) {
			usage();
			return;
		}

		Class<?> analyzerClass = Class.forName("org.apache.lucene.analysis." + args[0] + "." + args[1]);
		Method getStopSetMethod = analyzerClass.getDeclaredMethod("getDefaultStopSet");

		/* nl does not extends StopwordAnalyzerBase - using static getDefaultStopSet method instead */

		//Constructor<?> analyzerCtor = analyzerClass.getConstructor(org.apache.lucene.util.Version.class);
		//Object stopbase = analyzerCtor.newInstance(org.apache.lucene.util.Version.LUCENE_41);
		//Iterator<Object> iter = ((org.apache.lucene.analysis.util.StopwordAnalyzerBase)stopbase).getStopwordSet().iterator();

		/* Returns an Iterator for char[] instances in this set */

		Iterator<Object> iter = ((org.apache.lucene.analysis.util.CharArraySet)getStopSetMethod.invoke(null)).iterator();

		if (!iter.hasNext()) {
			throw new UnsupportedOperationException("Empty stop list for language " + args[0]);
		}

		while (iter.hasNext()) {
			char[] stopword = (char[])iter.next();
			if (stopword.length > 0) {
				System.out.println(stopword);
			}
		}
	}

}
